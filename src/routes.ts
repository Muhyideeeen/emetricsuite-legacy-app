import { lazy } from "react";

export const serviceAccountRoutes = [
  {
    path: "/organization-structure",
    component: lazy(() => import("./pages/serviceAccount/orgStructure")),
    exact: true,
  },
  {
    path: "/settings",
    component: lazy(() => import("./pages/serviceAccount/settings")),
    exact: false,
  },
  {
    path: "/corporate-level",
    component: lazy(() => import("./pages/serviceAccount/setupCorporate")),
    exact: false,
  },
  {
    path: "/create-organization",
    component: lazy(() => import("./pages/serviceAccount/createOrganization")),
    exact: false,
  },
  {
    path: "/organization-structure/corporates",
    component: lazy(() => import("./pages/org-structure/corporates")),
    exact: false,
  },
  {
    path: "/organization-structure/divisions",
    component: lazy(() => import("./pages/org-structure/divisions")),
    exact: false,
  },
  {
    path: "/organization-structure/groups",
    component: lazy(() => import("./pages/org-structure/groups")),
    exact: false,
  },
  {
    path: "/organization-structure/departments",
    component: lazy(() => import("./pages/org-structure/departments")),
    exact: false,
  },
  {
    path: "/organization-structure/units",
    component: lazy(() => import("./pages/org-structure/units")),
    exact: false,
  },
  {
    path: "/organization-structure/employees",
    component: lazy(() => import("./pages/org-structure/employees")),
    exact: false,
  },
];

export const tenantRoutes = [
  {
    path: "/home",
    component: lazy(() => import("./pages/index")),
    exact: false,
  },
  {
    path: "/strategy-deck",
    component: lazy(() => import("./pages/strategyDeck")),
    exact: false,
  },
  {
    path:"/reports",
    component:lazy(()=>import("./pages/reports")),
    exact:false,
  },

  {
    path:"/initiative-report/:initiativeID",
    component:lazy(()=>import("./pages/Reports/InitiativeReport")),
    exact:false,
  },


  {
    path: "/dashboard-page",
    component: lazy(() => import("./pages/dashboard")),
    exact: false,
  },
  {
    path: "/tasks",
    component: lazy(() => import("./pages/tasks")),
    exact: false,
  },
  {
    path:'/task-calendar',
    component:lazy(()=> import('./pages/TaskCalendar'))
  },
  {
    path: "/human-performance-management",
    component: lazy(() => import("./pages/Reports/HumanPerformance")),
    exact: false,
  },
{
  path:'/teamleadkpi',
  component: lazy(() => import("./pages/TeamLeadCreateInitiative")),
  exact: false,
},
    {
    path: "/corporate-report",
    component: lazy(() => import("./pages/Reports/CorporatePerformance")),
    exact: false,
  },

  {
    path: "/submit-task/:is_taskowner/:task_id/:rework_limit/:task_type/:task_name",
    component: lazy(() => import("./pages/submitTask")),
    exact: false,
  },
  {
    path: "/rate-task",
    component: lazy(() => import("./pages/rateTask")),
    exact: false,
  },
  {
    path: "/cpm",
    component: lazy(() => import("./pages/cpm")),
    exact: false,
  },
  {
    path: "/messages",
    component: lazy(() => import("./pages/messages")),
    exact: false,
  },

  {
    path: "/Settings",
    component: lazy(() => import("./pages/Settings")),
    exact: false,
  },

  {
    path: "/profile",
    component: lazy(() => import("./pages/profile")),
    exact: false,
  },
];



export const tenantManagent = [
  {
    path: "/home",
    component: lazy(() => import("./pages/SuperadminManagment/TenantManage")),
    exact: false,
  },
]