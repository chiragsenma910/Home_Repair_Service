const express = require('express');
const router = express.Router();
const authController = require('./controllers/auth');
const authRenderController = require('./controllers/auth-render');
const imageController = require('./controllers/imageUpload');
const forgotPasswordController = require('./controllers/forgot-password');
const findWorkerController = require('./controllers/auth-findworker');
const geolocationController = require('./controllers/geolocation');
const appointmentController = require('./controllers/appointments'); // Import the appointment controller
const paymentController = require('./controllers/payment'); // Import the appointment controller
const adminController = require('./controllers/admincontrol'); // Import the appointment controller

router.get('/homepage', authRenderController.renderHomePage);
router.get('/serviceselection', authRenderController.renderServiceSelection);
router.get('/aboutus', authRenderController.renderAboutUs);
router.get('/contactus', authRenderController.renderContactUs);
router.get('/joinus', authRenderController.renderJoinUs);
router.get('/login', authRenderController.renderLoginPage);
router.get('/logout', authRenderController.logout);
router.get('/signup', authRenderController.renderSignupPage);
router.get('/states', geolocationController.state);
router.get('/districts/:stateId', geolocationController.district);
router.get('/cities/:districtId', geolocationController.city);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/userprofile', authRenderController.renderUserProfilePage);
router.get('/userservice', authRenderController.renderServiceDashboardPage);
router.get('/workerprofile', authRenderController.renderWorkerProfilePage);
router.get('/userchangepassword', authRenderController.renderChangePassword);
router.get('/workerchangepassword', authRenderController.renderChangePassword);
router.get('/workerservice', authRenderController.renderWorkerServiceDashboardPage);
router.post('/api/update-user-info', authController.updateUserInfo);
router.post('/api/upload-profile-image', imageController.handleUpload);
router.post('/forgot-password/send-otp', forgotPasswordController.sendOTP);
router.post('/forgot-password/verify-otp', forgotPasswordController.verifyOTP);
router.post('/forgot-password/set-password', forgotPasswordController.setPassword); // Set new password route
router.post('/api/update-password', authController.updatePassword); // Add this line for updating password
router.post('/api/findworkers', findWorkerController.findWorkers); // Route for finding workers

// Appointment routes
router.post('/api/appointments/book', appointmentController.bookAppointment); // Route for booking an appointment
router.get('/api/appointments/user', appointmentController.getUserAppointments); // Route for fetching user appointments
router.get('/api/appointments/worker', appointmentController.getWorkerRequests); // Route for fetching worker requests
router.post('/api/appointments/accept', appointmentController.acceptAppointment); // Route for accepting an appointment
router.post('/api/appointments/reject', appointmentController.rejectAppointment); // Route for canceling an appointment
router.post('/api/appointments/cancel', appointmentController.cancelAppointment); // Route for canceling an appointment
router.post('/api/appointments/start', appointmentController.startAppointment); // Route for canceling an appointment
router.post('/api/appointments/complete', appointmentController.completeAppointment); // Route for canceling an appointment
router.post('/api/review/submit', paymentController.submitRating); // Route for canceling an appointment


router.get('/Admin_89',authRenderController.renderAdminLogin);
router.post('/Admin',authRenderController.renderAdmin);
router.get('/manageuser',authRenderController.renderAdminUser);
router.get('/manageworker',authRenderController.renderAdminWorker);
router.get('/manageappointments',authRenderController.renderAdminAppointment);

router.get('/api/users', adminController.fetchAllUsers);
router.post('/api/users/delete', adminController.deleteUser);
router.get('/api/appointments', adminController.fetchAllAppointments);
router.post('/api/appointments/delete', adminController.deleteAppointment);
router.post('/api/workers', adminController.fetchAllWorkers);
router.post('/api/workers/delete', adminController.deleteWorker);


module.exports = router;
