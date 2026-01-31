import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetching data from your Backend (Day 23 CRUD logic)
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const url =
          selectedCategory === 'All'
            ? 'http://localhost:5000/api/plants'
            : `http://localhost:5000/api/plants/category/${selectedCategory}`;

        const response = await axios.get(url);
        setPlants(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plants:", error);
        setLoading(false);
      }
    };

    fetchPlants();
  }, [selectedCategory]);

  // Logic to add plant to user favorites
  const addToFavorites = async (plantId) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Please login first to save plants! 🌿");
      return;
    }

    try {
      // Sending request to your server.js favorite endpoint
      const res = await axios.post('http://localhost:5000/api/user/favorite', { 
        userId, 
        plantId 
      });
      
      // Success Pop-up as requested
      alert(res.data.message + " 🌱 Check your Favorite page!"); 
    } catch (err) {
      console.error(err);
      alert("Could not add to favorites. Make sure the server is running!");
    }
  };

  return (
    <div className="container mt-4">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-success">Plantify Showcase</h1>
        <p className="lead text-muted">Explore our curated collection of green friends</p>
      </header>

      {/* Category Filter Bar */}
      <div className="d-flex justify-content-center flex-wrap gap-3 mb-5">
        {['All', 'Indoor', 'Medicinal', 'Outdoor'].map((cat) => (
          <button
            key={cat}
            className={`btn ${selectedCategory === cat ? 'btn-success' : 'btn-outline-success'} rounded-pill px-4`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {plants.length > 0 ? (
            plants.map((plant) => (
              <div className="col-md-4 mb-4" key={plant._id}>
                <div className="card h-100 shadow-sm border-0 transition-hover">
                  <img
                    src={plant.img || 'https://via.placeholder.com/300x200?text=No+Image'}
                    className="card-img-top"
                    alt={plant.name}
                    style={{ height: '220px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0">{plant.name}</h5>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        {plant.category}
                      </span>
                    </div>
                    <p className="card-text text-secondary small">
                      {plant.description || "No description provided."}
                    </p>
                  </div>
                  <div className="card-footer bg-white border-0 pb-3">
                    {/* Updated button with click handler */}
                    <button 
                      className="btn btn-outline-danger w-100 btn-sm"
                      onClick={() => addToFavorites(plant._id)}
                    >
                      ❤️ Add to Favorites
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center py-4">
                No plants found in the <strong>{selectedCategory}</strong> category 🌱
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;