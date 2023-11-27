import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
// import userEvent from "@testing-library/user-event";

import CourseDetailsIndexPage from "main/pages/CourseDetails/CourseDetailsIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      qtr: "20221",
      enrollCode: "06619",
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});
describe("Course Details Index Page tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/sections/sectionsearch", {
        params: { qtr: "20221", enrollCode: "06619" },
      })
      .reply(200, {
        quarter: "20221",
        courseId: "CHEM    184  ",
        title: "CHEM LITERATURE",
        contactHours: 20,
        description:
          "Lectures and exercises on the literature and other information resources of use in chemistry.",
        college: "L&S",
        objLevelCode: "U",
        subjectArea: "CHEM    ",
        unitsFixed: 2,
        unitsVariableHigh: null,
        unitsVariableLow: null,
        delayedSectioning: null,
        inProgressCourse: null,
        gradingOption: null,
        instructionType: "LEC",
        onLineCourse: false,
        deptCode: "CHEM ",
        generalEducation: [],
        classSections: [
          {
            enrollCode: "06619",
            section: "0100",
            session: null,
            classClosed: null,
            courseCancelled: null,
            gradingOptionCode: null,
            enrolledTotal: 19,
            maxEnroll: 24,
            secondaryStatus: null,
            departmentApprovalRequired: false,
            instructorApprovalRequired: false,
            restrictionLevel: null,
            restrictionMajor: null,
            restrictionMajorPass: null,
            restrictionMinor: null,
            restrictionMinorPass: null,
            concurrentCourses: ["CHEM    284  0100"],
            timeLocations: [
              {
                room: "1312",
                building: "LIB",
                roomCapacity: null,
                days: " T R   ",
                beginTime: "14:00",
                endTime: "15:15",
              },
            ],
            instructors: [
              {
                instructor: "HUBER C F",
                functionCode: "Teaching and in charge",
              },
            ],
          },
        ],
      });
  });

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDetailsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Calls UCSB Section Search api correctly and displays correct information", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDetailsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    // await waitFor(() => {
    expect(
      screen.getByText("Course Details for CHEM 184 W22!"),
    ).toBeInTheDocument();
    // });
    expect(screen.getByText("Enroll Code")).toBeInTheDocument();
    expect(screen.getByText("06619")).toBeInTheDocument();
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByText("0100")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("CHEM LITERATURE")).toBeInTheDocument();
    expect(screen.getByText("Enrolled")).toBeInTheDocument();
    expect(screen.getByText("19/24")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("LIB 1312")).toBeInTheDocument();
    expect(screen.getByText("Days")).toBeInTheDocument();
    expect(screen.getByText("T R")).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("2:00 PM - 3:15 PM")).toBeInTheDocument();
  });
});
