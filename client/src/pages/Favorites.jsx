import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  // Function to fetch favorite plants from the backend
  const fetchFavs = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/favorites/${userId}`);
      setFavs(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Protected Route: If no token, kick user to login
    if (!token) {
      navigate('/login');
      return;
    }
    if (userId) fetchFavs();
  }, [token, userId, navigate, fetchFavs]);

  // Function to remove a plant from favorites
  const removeFromFavorites = async (plantId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/favorite/remove', { 
        userId, 
        plantId 
      });
      
      alert(res.data.message); // "Removed from favorites!"
      fetchFavs(); // Refresh the list immediately
    } catch (err) {
      console.error("Remove error:", err);
      alert("Error removing plant. Check if the server is running.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success fw-bold">{username}'s Green Favorites ❤️</h2>
        <span className="badge bg-success rounded-pill">{favs.length} Plants</span>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {favs.length > 0 ? (
            favs.map((plant) => (
              <div className="col-md-4 mb-4" key={plant._id}>
                <div className="card h-100 shadow-sm border-0 transition-hover">
                  <img
                    src={plant.img || 'https://via.placeholder.com/300x200'}
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
                      {plant.description}
                    </p>
                  </div>
                  <div className="card-footer bg-white border-0 pb-3">
                    <button
                      className="btn btn-outline-danger w-100 btn-sm"
                      onClick={() => removeFromFavorites(plant._id)}
                    >
                       Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="alert alert-light border shadow-sm">
                <p className="mb-3 text-muted">You haven't added any favorites yet!</p>
                <button className="btn btn-success" onClick={() => navigate('/')}>
                  Go Explore Plants 🌱
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Favorites;