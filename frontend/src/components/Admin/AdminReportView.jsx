import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Toolbar, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem
} from '@mui/material';
import { styled } from '@mui/system';
import Sidebar from '../../components/Navigation/Sidebar';
import useAuth from '../../components/Auth/useAuth';

const AdminReportsPage = () => {
  const { activeTab, setActiveTab } = useAuth();
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState('');

  const StyledContainer = styled(Container)({
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  });

  const StyledTableHead = styled(TableHead)({
    backgroundColor: '#6200ea',
    '& th': {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1rem',
    }
  });

  const HighlightText = styled('span')({
    fontWeight: 'bold',
    color: '#6200ea'
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/user-reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
      setFilteredReports(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = reports.filter(report =>
      report.issueType.toLowerCase().includes(search.toLowerCase()) ||
      report.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      report.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [search, reports]);

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/user-reports/${selectedReport.reportReference}/status`, {
        status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <Box display="flex" bgcolor="#f4f6fb" minHeight="100vh">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
        <Toolbar />
        <StyledContainer maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#6200ea' }}>
            Submitted User Reports
          </Typography>

          <TextField
            fullWidth
            label="Search by issue type, email or reference number"
            variant="outlined"
            margin="normal"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3 }}
          />

          {loading ? (
            <Box textAlign="center" mt={4}><CircularProgress /></Box>
          ) : error ? (
            <Typography color="error" mt={2}>{error}</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: '16px' }}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Report Ref</TableCell>
                    <TableCell>Issue Type</TableCell>
                    <TableCell>Router Ref</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Explanation</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow
                      key={report.reportReference}
                      hover
                      onClick={() => { setSelectedReport(report); setStatus(report.status); }}
                      sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { backgroundColor: '#f1f1f1' } }}
                    >
                      <TableCell>{report.reportReference}</TableCell>
                      <TableCell>{report.issueType}</TableCell>
                      <TableCell>{report.referenceNumber}</TableCell>
                      <TableCell>{report.email}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.status}</TableCell>
                      <TableCell>
                        {report.explanation.length > 60
                          ? report.explanation.slice(0, 60) + '...'
                          : report.explanation}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Dialog
            open={!!selectedReport}
            onClose={() => setSelectedReport(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ backgroundColor: '#6200ea', color: '#fff' }}>
              Report Details
            </DialogTitle>
            <DialogContent dividers>
              {selectedReport && (
                <Box>
                  <Typography gutterBottom><HighlightText>Report Reference:</HighlightText> {selectedReport.reportReference}</Typography>
                  <Typography gutterBottom><HighlightText>Issue Type:</HighlightText> {selectedReport.issueType}</Typography>
                  <Typography gutterBottom><HighlightText>Router Reference:</HighlightText> {selectedReport.referenceNumber}</Typography>
                  <Typography gutterBottom><HighlightText>Email:</HighlightText> {selectedReport.email}</Typography>
                  <Typography gutterBottom><HighlightText>Date:</HighlightText> {selectedReport.date}</Typography>
                  <Typography gutterBottom><HighlightText>Explanation:</HighlightText> {selectedReport.explanation}</Typography>
                  <Box mt={2}>
                    <Typography gutterBottom><HighlightText>Status:</HighlightText></Typography>
                    <Select
                      fullWidth
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="declined">Declined</MenuItem>
                    </Select>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedReport(null)}>Cancel</Button>
              <Button variant="contained" onClick={handleStatusUpdate} sx={{ backgroundColor: '#6200ea' }}>Update Status</Button>
            </DialogActions>
          </Dialog>
        </StyledContainer>
      </Box>
    </Box>
  );
};

export default AdminReportsPage;