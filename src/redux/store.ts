import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import loginReducer from "./auth/login/loginSlice";
import signUpReducer from "./auth/signUp/signUpSlice";
import loginTenantReducer from "./auth/tenantLogin/tenantLoginSlice";
import organizationReducer from "./organization/organizationSlice";
import employeesReducer from "./employees/employeesSlice";
import designationReducer from "./designation/DesignationSlice";
import jobDescriptionReducer from "./jobDescription/jobDescriptionSlice";
import refreshTokenReducer from "./auth/refreshToken/refreshTokenSlice";
import careerPathReducer from "./careerPath/careerPathSlice";
import perspectiveReducer from "./perspective/perspectiveSlice";
import objectiveReducer from "./objective/objectiveSlice";
import corporateReducer from "./corporate/corporateSlice";
import divisionReducer from "./division/divisionSlice";
import groupReducer from "./group/groupSlice";
import departmentReducer from "./department/departmentSlice";
import unitReducer from "./unit/unitSlice";
import jdAndIntiativeReducer from "./jdsAndIntiatives/jdsAndIntiativesSlice";
import taskReducer from "./Task/taskSlice";
import taskSubmissionReducer from "./TaskSubmission/TaskSubmissionSlice"
import ResendActivationMailApiSlice from "./ResendActivationMail/ResendActivationMailApiSlice";
import TaskSummarySlice from "./TaskSummary/TaskSummarySlice";
import PublicHolidaySlice from "./PublicHoliday/PublicHolidaySlice";
import LeaveManagementSlice from "./LeaveManagement/LeaveManagementSlice";
import LeaveApplicationSlice from "./LeaveApplication/LeaveApplicationSlice";
import monthlyPayrollStructureSlice from "./payroll/monthlyPayrollStructure/monthlyPayrollStructureSlice";
import MonthlyGenerateTableSlice from "./payroll/monthlyPayrollStructure/MonthlyGenerateTable/MonthlyGenerateTableSlice";
import TenantAdminManagerSlice from "./TenantAdminManager/TenantAdminManagerSlice";
export const store = configureStore({
  reducer: {
    login: loginReducer,
    signUp: signUpReducer,
    loginTenant: loginTenantReducer,
    organization: organizationReducer,
    employees: employeesReducer,
    designation: designationReducer,
    jobDescription: jobDescriptionReducer,
    refreshToken: refreshTokenReducer,
    careerPath: careerPathReducer,
    perspective: perspectiveReducer,
    objective: objectiveReducer,
    corporate: corporateReducer,
    division: divisionReducer,
    group: groupReducer,
    department: departmentReducer,
    unit: unitReducer,
    jdAndIntiative:jdAndIntiativeReducer,
    task:taskReducer,
    taskSubmission:taskSubmissionReducer,
    resendActivationMail:ResendActivationMailApiSlice,
    tasksummary:TaskSummarySlice,
    publicholiday:PublicHolidaySlice,
    leave:LeaveManagementSlice,
    leave_application:LeaveApplicationSlice,
    monthly_payroll_structure:monthlyPayrollStructureSlice,
    monthly_generate_table:MonthlyGenerateTableSlice,
    tenant_admin_management:TenantAdminManagerSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
