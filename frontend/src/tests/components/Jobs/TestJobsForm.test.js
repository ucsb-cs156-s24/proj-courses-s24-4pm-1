import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import TestJobsForm from "main/components/Jobs/TestJobForm";
import jobsFixtures from "fixtures/jobsFixtures";
import userEvent from '@testing-library/user-event';

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("TestJobsForm tests", () => {
  it("renders correctly with the right defaults", async () => {
    render(
      <Router>
        <TestJobsForm />
      </Router>,
    );

    expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();
    expect(
      await screen.findByTestId("TestJobForm-sleepMs"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Submit/)).toBeInTheDocument();
  });

  it("has validation errors for required fields", async () => {
    const submitAction = jest.fn();

    render(
      <Router>
        <TestJobsForm jobs={jobsFixtures.sixJobs} />
      </Router>,
    );

    expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();
    const submitButton = screen.getByTestId("TestJobForm-Submit-Button");
    const sleepMs = screen.getByTestId("TestJobForm-sleepMs");

    expect(submitButton).toBeInTheDocument();
    expect(sleepMs).toHaveValue(1000);

    fireEvent.change(sleepMs, { target: { value: "70000" } });
    expect(sleepMs).toHaveValue(70000);
    fireEvent.blur(sleepMs); 

    fireEvent.click(submitButton);
    expect(await screen.findByText(/sleepMs may not be/i)).toBeInTheDocument();
    expect(sleepMs).toHaveClass('is-invalid');
    expect(submitAction).not.toBeCalled();
  });

  it("rejects sleepMs values below the minimum threshold", async () => {
    const submitAction = jest.fn();
  
    render(
      <Router>
        <TestJobsForm />
      </Router>,
    );
  
    const submitButton = screen.getByTestId("TestJobForm-Submit-Button");
    const sleepMs = screen.getByTestId("TestJobForm-sleepMs");
    expect(sleepMs).toBeValid();
  
    fireEvent.change(sleepMs, { target: { value: "-1" } });
    expect(sleepMs).toHaveValue(-1);
    fireEvent.click(submitButton);
  
    expect(await screen.findByText(/sleepMs must be positive/i)).toBeInTheDocument();
    expect(submitAction).not.toBeCalled();
  });
  

  it("displays an error when sleepMs is not provided", async () => {
    const submitAction = jest.fn();
  
    render(
      <Router>
        <TestJobsForm />
      </Router>,
    );
  
    const submitButton = screen.getByTestId("TestJobForm-Submit-Button");
    const sleepMs = screen.getByTestId("TestJobForm-sleepMs");
  
    fireEvent.change(sleepMs, { target: { value: "" } });
    fireEvent.click(submitButton);
  
    expect(await screen.findByText(/sleepMs is required/i)).toBeInTheDocument();
    expect(submitAction).not.toBeCalled();
  });
  

  it("should handle non-numeric value for sleepMs when valueAsNumber is true", async () => {
    const submitAction = jest.fn();

    render(
      <Router>
        <TestJobsForm />
      </Router>
    );

    const sleepMsInput = screen.getByTestId("TestJobForm-sleepMs");
    userEvent.type(sleepMsInput, "not-a-number");
    fireEvent.click(screen.getByTestId("TestJobForm-Submit-Button"));

    expect(submitAction).not.toHaveBeenCalled();
  });
});
