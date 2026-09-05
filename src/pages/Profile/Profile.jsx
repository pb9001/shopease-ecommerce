import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";

import "./Profile.css";

function Profile() {
  const { wishlistItems } = useWishlist();
  const { cartCount } = useCart();
  const { orders } = useOrders();
  const navigate = useNavigate();
  const { logout } = useAuth();


  const handleLogout = () => {
  logout();
  alert("Logged out successfully!");
  navigate("/");
};

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("shopease_user");

    return savedProfile
      ? JSON.parse(savedProfile)
      : {
          name: "ShopEase User",
          email: "user@example.com",
        };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);

  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);

  const [addresses, setAddresses] = useState(() => {
    const savedAddresses =
      localStorage.getItem("shopease_addresses");

    return savedAddresses
      ? JSON.parse(savedAddresses)
      : [];
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressForm, setAddressForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  const handleEditProfile = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setIsEditing(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!editName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!editEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    const updatedProfile = {
      name: editName.trim(),
      email: editEmail.trim(),
    };

    setProfile(updatedProfile);

    localStorage.setItem(
      "shopease_user",
      JSON.stringify(updatedProfile)
    );

    setIsEditing(false);

    alert("Profile updated successfully!");
  };

  const openAddressForm = () => {
    setEditingAddressId(null);

    setAddressForm({
      name: profile.name,
      address: "",
      city: "",
      state: "",
      pin: "",
    });

    setShowAddressForm(true);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddressForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();

    if (addressForm.pin.length !== 6) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    let updatedAddresses;

    if (editingAddressId) {
      updatedAddresses = addresses.map((address) =>
        address.id === editingAddressId
          ? {
              ...address,
              ...addressForm,
            }
          : address
      );
    } else {
      const newAddress = {
        id: Date.now(),
        ...addressForm,
      };

      updatedAddresses = [
        ...addresses,
        newAddress,
      ];
    }

    setAddresses(updatedAddresses);

    localStorage.setItem(
      "shopease_addresses",
      JSON.stringify(updatedAddresses)
    );

    setShowAddressForm(false);
    setEditingAddressId(null);

    alert(
      editingAddressId
        ? "Address updated successfully!"
        : "Address added successfully!"
    );
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id);

    setAddressForm({
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      pin: address.pin,
    });

    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedAddresses = addresses.filter(
      (address) => address.id !== id
    );

    setAddresses(updatedAddresses);

    localStorage.setItem(
      "shopease_addresses",
      JSON.stringify(updatedAddresses)
    );
  };

  return (
    <div className="profile-page">

      <header className="profile-header">
        <Link to="/catalogue">
          <h1>ShopEase</h1>
        </Link>

        <nav>
          <Link to="/catalogue">
            🛍 Catalogue
          </Link>

          <Link to="/wishlist">
            ♥ Wishlist ({wishlistItems.length})
          </Link>

          <Link to="/cart">
            🛒 Cart ({cartCount})
          </Link>
        </nav>
      </header>

      <main className="profile-content">

        <div className="profile-heading">
          <h2>My Profile</h2>
          <p>Manage your ShopEase account</p>
        </div>

        {!isEditing ? (
          <section className="profile-card">

            <div className="profile-avatar">
              👤
            </div>

            <div className="profile-info">
              <h3>{profile.name}</h3>

              <p>
                <strong>Email:</strong>{" "}
                {profile.email}
              </p>

              <p>
                <strong>Account:</strong>{" "}
                Customer
              </p>

              <p>
                <strong>Member since:</strong>{" "}
                2026
              </p>
            </div>

            <div className="profile-actions">

              <button
                type="button"
                onClick={handleEditProfile}
              >
                ✏️ Edit Profile
              </button>

              <Link
                to="/orders"
                className="profile-action-btn"
              >
                📦 My Orders
              </Link>

              <button
                type="button"
                onClick={() =>
                  setShowAddresses(
                    !showAddresses
                  )
                }
              >
                📍 Manage Addresses
              </button>
              
              <button
               type="button"
               className="logout-btn"
              onClick={handleLogout}
                >
              🚪 Logout
             </button>



            </div>

          </section>
        ) : (
          <section className="profile-edit-card">

            <div className="edit-header">
              <h3>Edit Profile</h3>

              <button
                type="button"
                className="close-edit"
                onClick={() =>
                  setIsEditing(false)
                }
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>

              <label htmlFor="profile-name">
                Full Name
              </label>

              <input
                id="profile-name"
                type="text"
                value={editName}
                onChange={(e) =>
                  setEditName(e.target.value)
                }
                placeholder="Enter your name"
              />

              <label htmlFor="profile-email">
                Email Address
              </label>

              <input
                id="profile-email"
                type="email"
                value={editEmail}
                onChange={(e) =>
                  setEditEmail(e.target.value)
                }
                placeholder="Enter your email"
              />

              <div className="edit-actions">

                <button
                  type="submit"
                  className="save-profile-btn"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  className="cancel-profile-btn"
                  onClick={() =>
                    setIsEditing(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>
        )}

        {showAddresses && (
          <section className="address-section">

            <div className="address-header">
              <div>
                <h3>Saved Addresses</h3>
                <p>
                  Manage your delivery addresses
                </p>
              </div>

              <button
                type="button"
                onClick={openAddressForm}
              >
                + Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="empty-address">
                <div>📍</div>
                <h4>No saved addresses</h4>
                <p>
                  Add an address for faster checkout.
                </p>
              </div>
            ) : (
              <div className="address-grid">

                {addresses.map((address) => (
                  <div
                    className="address-card"
                    key={address.id}
                  >

                    <h4>{address.name}</h4>

                    <p>
                      {address.address}
                    </p>

                    <p>
                      {address.city},{" "}
                      {address.state}
                    </p>

                    <p>
                      PIN: {address.pin}
                    </p>

                    <div className="address-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleEditAddress(
                            address
                          )
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="delete-address"
                        onClick={() =>
                          handleDeleteAddress(
                            address.id
                          )
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

            {showAddressForm && (
              <div className="address-form-card">

                <div className="edit-header">
                  <h3>
                    {editingAddressId
                      ? "Edit Address"
                      : "Add New Address"}
                  </h3>

                  <button
                    type="button"
                    className="close-edit"
                    onClick={() =>
                      setShowAddressForm(false)
                    }
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveAddress}>

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressChange}
                    placeholder="Enter full name"
                    required
                  />

                  <label>
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={addressForm.address}
                    onChange={handleAddressChange}
                    placeholder="House no., street, area"
                    required
                  />

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    placeholder="Enter city"
                    required
                  />

                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    placeholder="Enter state"
                    required
                  />

                  <label>
                    PIN Code
                  </label>

                  <input
                    type="text"
                    name="pin"
                    value={addressForm.pin}
                    onChange={handleAddressChange}
                    placeholder="6-digit PIN"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />

                  <div className="edit-actions">

                    <button
                      type="submit"
                      className="save-profile-btn"
                    >
                      Save Address
                    </button>

                    <button
                      type="button"
                      className="cancel-profile-btn"
                      onClick={() =>
                        setShowAddressForm(false)
                      }
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>
            )}

          </section>
        )}

        <section className="profile-stats">

          <Link
            to="/wishlist"
            className="stat-card"
          >
            <span>♥</span>
            <strong>
              {wishlistItems.length}
            </strong>
            <p>Wishlist Items</p>
          </Link>

          <Link
            to="/cart"
            className="stat-card"
          >
            <span>🛒</span>
            <strong>{cartCount}</strong>
            <p>Cart Items</p>
          </Link>

          <Link
            to="/orders"
            className="stat-card"
          >
            <span>📦</span>
            <strong>{orders.length}</strong>
            <p>Orders</p>
          </Link>

        </section>

        <div className="profile-bottom">
          <Link to="/catalogue">
            ← Continue Shopping
          </Link>
        </div>

      </main>

    </div>
  );
}

export default Profile;