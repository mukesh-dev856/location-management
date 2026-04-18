import { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/shared/PageHeader';
import { apiService } from '../services/apiService';
import { useToast } from '../context/ToastContext';

const Cities = () => {
  const { showToast } = useToast();
  const [cities, setCities] = useState([]);
  const [activeStates, setActiveStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', stateId: '', status: 'Active' });
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });
  const [saving, setSaving] = useState(false);

  const fetchCities = useCallback(async (query = '', page = 1) => {
    setLoading(true);
    try {
      const result = await apiService.getCities(query, page);
      if (result.status) {
        setCities(result.data.cities);
        setPagination({
          totalItems: result.data.totalItems,
          totalPages: result.data.totalPages,
          currentPage: result.data.currentPage,
        });
      }
    } catch (err) {
      console.error('Fetch Cities Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveStates = async () => {
    try {
      const result = await apiService.getActiveStates();
      if (result.status) {
        setActiveStates(result.data);
      }
    } catch (err) {
      console.error('Fetch Active States Error:', err);
    }
  };

  useEffect(() => {
    fetchActiveStates();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCities(search, 1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchCities]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', stateId: '', status: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, stateId: item.stateId, status: item.status });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.stateId) return;
    setSaving(true);
    try {
      let result;
      if (editItem) {
        result = await apiService.updateCity(editItem.id, form);
      } else {
        result = await apiService.createCity(form);
      }

      if (result.status) {
        setShowModal(false);
        fetchCities(search, pagination.currentPage);
        showToast(editItem ? 'City updated successfully!' : 'City created successfully!', 'success');
      } else {
        showToast(result.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Server error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await window.Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b66dff',
      cancelButtonColor: '#fe7c96',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const result = await apiService.deleteCity(id);
        if (result.status) {
          fetchCities(search, pagination.currentPage);
          showToast('City deleted successfully!', 'success');
        } else {
          showToast(result.message || 'Delete failed', 'error');
        }
      } catch (err) {
        showToast('Failed to delete city', 'error');
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const result = await window.Swal.fire({
      title: 'Change Status?',
      text: `Do you want to change status to ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#b66dff',
      cancelButtonColor: '#fe7c96',
      confirmButtonText: 'Yes, change it!'
    });

    if (result.isConfirmed) {
      try {
        const result = await apiService.updateCityStatus(id, newStatus);
        if (result.status) {
          setCities(cities.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
          showToast(`Status updated to ${newStatus}`, 'success');
        }
      } catch (err) {
        showToast('Failed to update status', 'error');
      }
    }
  };

  return (
    <>
      <PageHeader title="Cities" icon="mdi-city" breadcrumbs={['Location Management', 'Cities']} />

      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">All Cities</h4>
                <button
                  className="btn btn-gradient-primary btn-sm"
                  id="createCityBtn"
                  onClick={openCreate}
                >
                  <i className="mdi mdi-plus me-1"></i> Add City
                </button>
              </div>

              {/* Filters */}
              <div className="d-flex gap-3 mb-4 flex-wrap">
                <div className="input-group" style={{ maxWidth: 280 }}>
                  <div className="input-group-prepend bg-transparent">
                    <i className="input-group-text border-0 mdi mdi-magnify"></i>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search cities..."
                    id="citySearchInput"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>City Name</th>
                      <th>State</th>
                      <th>Created At</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : cities.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">
                          No cities found.
                        </td>
                      </tr>
                    ) : (
                      cities.map((city, index) => (
                        <tr key={city.id}>
                          <td>{(pagination.currentPage - 1) * 10 + index + 1}</td>
                          <td className="font-weight-bold">{city.name}</td>
                          <td>{city.State?.name || 'N/A'}</td>
                          <td>{new Date(city.createdAt).toLocaleDateString()}</td>
                          <td>
                            <label
                              className={`badge ${city.status === 'Active'
                                  ? 'badge-gradient-success'
                                  : 'badge-gradient-warning'
                                }`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => toggleStatus(city.id, city.status)}
                              title="Click to toggle status"
                            >
                              {city.status}
                            </label>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm me-1"
                              id={`editCity-${city.id}`}
                              onClick={() => openEdit(city)}
                            >
                              <i className="mdi mdi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              id={`deleteCity-${city.id}`}
                              onClick={() => handleDelete(city.id)}
                            >
                              <i className="mdi mdi-delete"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <small className="text-muted">
                  Showing {cities.length} of {pagination.totalItems} cities
                </small>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={pagination.currentPage === 1}
                    onClick={() => fetchCities(search, pagination.currentPage - 1)}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => fetchCities(search, pagination.currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" id="cityModal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editItem ? 'Edit City' : 'Add New City'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    id="closeCityModal"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group mb-4">
                    <label htmlFor="cityNameInput" className="font-weight-bold">City Name</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-gradient-primary text-white">
                          <i className="mdi mdi-city"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control text-dark"
                        id="cityNameInput"
                        placeholder="e.g. Mumbai"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={{ height: 'calc(2.25rem + 2px)' }}
                      />
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="cityStateSelect" className="font-weight-bold">State</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-gradient-info text-white">
                          <i className="mdi mdi-map"></i>
                        </span>
                      </div>
                      <select
                        className="form-control text-dark"
                        id="cityStateSelect"
                        value={form.stateId}
                        onChange={(e) => setForm({ ...form, stateId: e.target.value })}
                        style={{
                          height: 'calc(2.25rem + 2px)',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '16px 12px',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="" disabled>Select State</option>
                        {activeStates.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="cityStatusSelect" className="font-weight-bold">Status</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-gradient-success text-white">
                          <i className="mdi mdi-check-circle"></i>
                        </span>
                      </div>
                      <select
                        className="form-control text-dark"
                        id="cityStatusSelect"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        style={{
                          height: 'calc(2.25rem + 2px)',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '16px 12px',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="" disabled>Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-gradient-primary"
                    id="saveCityBtn"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      editItem ? 'Save Changes' : 'Create City'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
        </>
      )}
    </>
  );
};

export default Cities;
