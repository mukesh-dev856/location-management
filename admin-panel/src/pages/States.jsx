import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/shared/PageHeader';
import { apiService } from '../services/apiService';
import { useToast } from '../context/ToastContext';

const States = () => {
  const { showToast } = useToast();
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', status: 'Active' });
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });
  const [saving, setSaving] = useState(false);

  const fetchStates = useCallback(async (query = '', page = 1) => {
    setLoading(true);
    try {
      const result = await apiService.getStates(query, page);
      if (result.status) {
        setStates(result.data.states);
        setPagination({
          totalItems: result.data.totalItems,
          totalPages: result.data.totalPages,
          currentPage: result.data.currentPage,
        });
      }
    } catch (err) {
      console.error('Fetch States Error:', err);
      showToast('Failed to fetch states', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStates(search, 1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchStates]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', status: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, status: item.status });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      let result;
      if (editItem) {
        result = await apiService.updateState(editItem.id, form);
      } else {
        result = await apiService.createState(form);
      }

      if (result.status) {
        setShowModal(false);
        fetchStates(search, pagination.currentPage);
        showToast(editItem ? 'State updated successfully!' : 'State created successfully!', 'success');
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
        const result = await apiService.deleteState(id);
        if (result.status) {
          fetchStates(search, pagination.currentPage);
          showToast('State deleted successfully!', 'success');
        } else {
          showToast(result.message || 'Delete failed', 'error');
        }
      } catch (err) {
        showToast(err.message || 'Server error', 'error');
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
        const result = await apiService.updateStateStatus(id, newStatus);
        if (result.status) {
          setStates(states.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
          showToast(`Status updated to ${newStatus}`, 'success');
        }
      } catch (err) {
        showToast('Failed to update status', 'error');
      }
    }
  };

  return (
    <>
      <PageHeader title="States" icon="mdi-map" breadcrumbs={['Location Management', 'States']} />

      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">All States</h4>
                <button
                  className="btn btn-gradient-primary btn-sm"
                  id="createStateBtn"
                  onClick={openCreate}
                >
                  <i className="mdi mdi-plus me-1"></i> Add State
                </button>
              </div>

              {/* Search */}
              <div className="input-group mb-4" style={{ maxWidth: 320 }}>
                <div className="input-group-prepend bg-transparent">
                  <i className="input-group-text border-0 mdi mdi-magnify"></i>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search states..."
                  id="stateSearchInput"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>State Name</th>
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
                    ) : states.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">
                          No states found.
                        </td>
                      </tr>
                    ) : (
                      states.map((state, index) => (
                        <tr key={state.id}>
                          <td>{(pagination.currentPage - 1) * 10 + index + 1}</td>
                          <td className="font-weight-bold">{state.name}</td>
                          <td>{new Date(state.createdAt).toLocaleDateString()}</td>
                          <td>
                            <label
                              className={`badge ${state.status === 'Active'
                                ? 'badge-gradient-success'
                                : 'badge-gradient-warning'
                                }`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => toggleStatus(state.id, state.status)}
                              title="Click to toggle status"
                            >
                              {state.status}
                            </label>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm me-1"
                              id={`editState-${state.id}`}
                              onClick={() => openEdit(state)}
                            >
                              <i className="mdi mdi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              id={`deleteState-${state.id}`}
                              onClick={() => handleDelete(state.id)}
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
                  Showing {states.length} of {pagination.totalItems} states
                </small>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={pagination.currentPage === 1}
                    onClick={() => fetchStates(search, pagination.currentPage - 1)}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => fetchStates(search, pagination.currentPage + 1)}
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
          <div className="modal fade show d-block" tabIndex="-1" id="stateModal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editItem ? 'Edit State' : 'Add New State'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    id="closeStateModal"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group mb-3">
                    <label htmlFor="stateNameInput">State Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="stateNameInput"
                      placeholder="e.g. Maharashtra"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="stateStatusSelect" className="font-weight-bold">Status</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-gradient-success text-white">
                          <i className="mdi mdi-check-circle"></i>
                        </span>
                      </div>
                      <select
                        className="form-control text-dark"
                        id="stateStatusSelect"
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
                    id="saveStateBtn"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      editItem ? 'Save Changes' : 'Create State'
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

export default States;
