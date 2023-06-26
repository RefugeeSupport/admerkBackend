// @formatting: off
// prettier-ignore

const express = require('express')

const UserController = require("./controllers/UserController");
const SkillsController = require("./controllers/SkillsController");
const HobbyController = require("./controllers/HobbyController");
const TicketController = require("./controllers/TicketController");
const HomeController = require("./controllers/HomeController");
const JobController = require("./controllers/JobController");
const ApplyJobController = require("./controllers/ApplyJobController");
const DashboardController = require("./controllers/DashboardController");
const BidController = require("./controllers/BidController");
const BootCampController = require("./controllers/BootCampController");
const CompanyConntroller = require("./controllers/CompanyController");

const { checkAuth, softAuth, checkCompAuth } = require("./middlewares");
const logger = require("./logger");
const MigrationsController = require("./controllers/MigrationsController");

const router = express.Router();

// home related routes
router.post("/fetch-home-feeds", checkCompAuth, HomeController.HomeFeed);
router.post("/fetch-home-jobs", checkAuth, HomeController.HomeFeedJobs);

// user related routes
router.post("/login", UserController.login);
router.post("/register-refugee", UserController.register);
router.post("/register-sponsor", UserController.register);
router.get("/verifyemail/:token", UserController.verifyEmail);
router.get("/resendVerification/:email", UserController.resendVerification);
router.get("/getAllUsers", checkAuth, UserController.getAllUsers);
router.get("/user-detail/:id", checkAuth, UserController.detail);
router.post("/resetPassword", UserController.resetPassword);
router.post("/change-password", checkAuth, UserController.changePassword);
router.get(
   "/change-user-status/:id/:status",
   checkAuth,
   UserController.changeStatus
);
router.get("/search-users", softAuth, UserController.searchUsers);
router.post("/invite-people", checkAuth, UserController.invitePeople);
router.post(
   "/search/refugees",
   checkCompAuth,
   UserController.searchRefugeeSkills
);
router.post(
   "/search/job-seeker",
   checkCompAuth,
   UserController.searchJobSeeker
);
router.post("/debashish/getUser", UserController.detailfromEmail);

//migrations
router.get("/migrations/run", MigrationsController.applyMigrations);

// jobPlusUser
router.get("/jobPlusUser/:userId:jobId", JobController.jobPlusUser);

// company related routes
router.get("/getAllCompanies", checkAuth, CompanyConntroller.getAllCompanies);
router.get(
   "/get-deatils/company/:id",
   checkCompAuth,
   CompanyConntroller.getDetail
);
router.post("/company/login", CompanyConntroller.login);
router.post("/register-company", CompanyConntroller.register);
router.get("/company/verifyemail/:token", CompanyConntroller.verifyEmail);
router.put(
   "/company/changePassword",
   checkCompAuth,
   CompanyConntroller.changePassword
);
router.put(
   "/company/changeStatus/:id:status",
   checkAuth,
   CompanyConntroller.changeStatus
);

// skills related routes
router.post("/create-skill", checkAuth, SkillsController.create);
router.get("/skills-list", SkillsController.getList);
router.get("/skill-detail/:id", checkAuth, SkillsController.getDetail);
router.post("/update-skill/:id", checkAuth, SkillsController.update);
router.get("/delete-skill/:id", checkAuth, SkillsController.deleteData);

// hobby related routes
router.post("/create-hobby", checkAuth, HobbyController.create);
router.get("/hobby-list", HobbyController.getList);
router.get("/hobby-detail/:id", checkAuth, HobbyController.getDetail);
router.post("/update-hobby/:id", checkAuth, HobbyController.update);
router.get("/delete-hobby/:id", checkAuth, HobbyController.deleteData);

// ticket routes
router.post("/create-ticket", checkAuth, TicketController.create);
router.get("/all-tickets", checkAuth, TicketController.getAll);
router.get("/ticket-detail/:id", checkAuth, TicketController.detail);
router.get(
   "/change-ticket-status/:id/:status",
   checkAuth,
   TicketController.changeStatus
);

// job related routes
router.post("/create-job", checkCompAuth, JobController.create);
router.post("/company/create-job", checkCompAuth, JobController.create);
router.get("/v1/getAllJobs", checkCompAuth, JobController.getAllJobs);
router.get("/job-details/:id", checkAuth, JobController.getDetail);
router.post("/update-job/:id", checkCompAuth, JobController.update);
router.get(
   "/change-job-status/:id/:status",
   checkCompAuth,
   JobController.changeStatus
);
router.get(
   "/job-applicant-list/:id",
   checkAuth,
   JobController.JobApplicantList
);
router.post("/apply-job/:id", checkAuth, ApplyJobController.apply);
router.get(
   "/get-state-by-country/:country_id",
   JobController.getStateByCountry
);
router.get("/get-city-by-state/:state_id", JobController.getCityByState);
router.get("/delete-job/:id", JobController.deleteJobDtata);

//Bid Routes

router.post("/create-bid", checkAuth, BidController.createBid);
router.get("/my-bids", checkAuth, BidController.myBids);

//BootCamp Routes

router.post("/submit-topic", checkAuth, BootCampController.submitTopic);
router.post("/create-bootcamp", checkCompAuth, BootCampController.create);
router.get(
   "/search-boot/:search_key",
   checkAuth,
   BootCampController.searchBoot
);
router.get("/getMineBoots", checkCompAuth, BootCampController.getMineBoots);
router.put("/update-boot/:id", checkCompAuth, BootCampController.updateBoot);
router.delete(
   "/delete-bootcamp/:id",
   checkCompAuth,
   BootCampController.deleteBoot
);
router.get("/search-bootcamp/:search_key", BootCampController.searchBoot);
router.get("/get-list", checkAuth, BootCampController.getList);
router.get(
   "/get-bootcamp-details/:id",
   checkAuth,
   BootCampController.getDetail
);

// dashboard routes
router.get("/dashboard-count", checkAuth, DashboardController.getCount);

// country routes
router.get("/country-list", async (req, res) => {
   let status = 500;
   let message = "Oops something went wrong!";
   let list = [];

   try {
      await knex("countries").then((response) => (list = response));
      status = 200;
      message = "Country fetched successfully!";
   } catch (error) {
      status = 500;
      message = error.message;
      logger.error(error);
   }

   return res.json({ status, message, list });
});

module.exports = router;
