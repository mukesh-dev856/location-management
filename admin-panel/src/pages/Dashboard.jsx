import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import PageHeader from '../components/shared/PageHeader';

Chart.register(...registerables);

const Dashboard = () => {
  const visitSaleRef = useRef(null);
  const trafficRef = useRef(null);
  const visitChartInstance = useRef(null);
  const trafficChartInstance = useRef(null);

  useEffect(() => {
    // Destroy previous instances to avoid canvas reuse error
    if (visitChartInstance.current) visitChartInstance.current.destroy();
    if (trafficChartInstance.current) trafficChartInstance.current.destroy();

    // Visit & Sales Bar Chart
    if (visitSaleRef.current) {
      visitChartInstance.current = new Chart(visitSaleRef.current, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'States Added',
              data: [3, 2, 5, 4, 6, 3, 7, 5, 8, 4, 9, 6],
              backgroundColor: 'rgba(111, 66, 193, 0.6)',
              borderColor: 'rgba(111, 66, 193, 1)',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: 'Cities Added',
              data: [12, 18, 22, 15, 30, 25, 40, 28, 35, 20, 45, 38],
              backgroundColor: 'rgba(0, 188, 212, 0.6)',
              borderColor: 'rgba(0, 188, 212, 1)',
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } },
          },
        },
      });
    }

    // Traffic Doughnut Chart
    if (trafficRef.current) {
      trafficChartInstance.current = new Chart(trafficRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Active States', 'Inactive States', 'Active Cities', 'Inactive Cities'],
          datasets: [
            {
              data: [28, 7, 142, 23],
              backgroundColor: [
                'rgba(111, 66, 193, 0.85)',
                'rgba(111, 66, 193, 0.3)',
                'rgba(0, 188, 212, 0.85)',
                'rgba(0, 188, 212, 0.3)',
              ],
              borderWidth: 2,
              borderColor: '#fff',
            },
          ],
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    }

    return () => {
      if (visitChartInstance.current) visitChartInstance.current.destroy();
      if (trafficChartInstance.current) trafficChartInstance.current.destroy();
    };
  }, []);

  const stats = [
    {
      label: 'Total States',
      value: '35',
      change: 'Active: 28',
      icon: 'mdi-map',
      gradient: 'bg-gradient-danger',
    },
    {
      label: 'Total Cities',
      value: '165',
      change: 'Active: 142',
      icon: 'mdi-city',
      gradient: 'bg-gradient-info',
    },
    {
      label: 'Total Locations',
      value: '200',
      change: 'Updated today: 12',
      icon: 'mdi-map-marker-multiple',
      gradient: 'bg-gradient-success',
    },
  ];

  const recentActivity = [
    { name: 'Maharashtra', type: 'State', action: 'Created', status: 'Active', statusClass: 'badge-gradient-success', date: 'Apr 17, 2026', id: 'LOC-001' },
    { name: 'Mumbai', type: 'City', action: 'Updated', status: 'Active', statusClass: 'badge-gradient-success', date: 'Apr 17, 2026', id: 'LOC-002' },
    { name: 'Rajasthan', type: 'State', action: 'Created', status: 'Inactive', statusClass: 'badge-gradient-warning', date: 'Apr 16, 2026', id: 'LOC-003' },
    { name: 'Pune', type: 'City', action: 'Deleted', status: 'Inactive', statusClass: 'badge-gradient-danger', date: 'Apr 15, 2026', id: 'LOC-004' },
  ];

  return (
    <>
      <PageHeader title="Dashboard" icon="mdi-home" breadcrumbs={['Overview']} />

      {/* Stat Cards */}
      <div className="row">
        {stats.map((stat, idx) => (
          <div className="col-md-4 stretch-card grid-margin" key={idx}>
            <div className={`card ${stat.gradient} card-img-holder text-white`}>
              <div className="card-body">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/dashboard/circle.svg`}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h4 className="font-weight-normal mb-3">
                  {stat.label}{' '}
                  <i className={`mdi ${stat.icon} mdi-24px float-end`}></i>
                </h4>
                <h2 className="mb-5">{stat.value}</h2>
                <h6 className="card-text">{stat.change}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-7 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="clearfix">
                <h4 className="card-title float-start">Location Activity — This Year</h4>
              </div>
              <canvas ref={visitSaleRef} className="mt-4" height="100"></canvas>
            </div>
          </div>
        </div>
        <div className="col-md-5 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Status Distribution</h4>
              <div className="doughnutjs-wrapper d-flex justify-content-center">
                <canvas ref={trafficRef} height="200"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Recent Activity</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Action</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.name}</td>
                        <td>{row.type}</td>
                        <td>{row.action}</td>
                        <td>
                          <label className={`badge ${row.statusClass}`}>{row.status}</label>
                        </td>
                        <td>{row.date}</td>
                        <td>{row.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
