// function UploadGradesJobForm() {
//   return <p>In progress! (The form for this job has not yet been created)</p>;
// }
import { Form, Button, Container, Row, Col } from "react-bootstrap";
// import { useForm } from "react-hook-form";

function UploadGradesJobForm() {

  const handleSubmit = (event) => {
    event.preventDefault();
    // callback({});
  };

  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
  const padding = { paddingTop: 10, paddingBottom: 10 };
  // Stryker restore all

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row style={padding}>
          <Col md="auto">
            <Button
              variant="primary"
              type="submit"
              data-testid="uploadGrades"
            >
              Update Grades
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default UploadGradesJobForm;
