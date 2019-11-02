import React, { Component } from "react";

import Course from "./Course.js";
import CourseNewForm from "./CourseNewForm.js";
class CoursesList extends Component {
  state = {
    courses: [],
    apiDataLoaded: false
  };

  async componentDidMount() {
    try {
      const response = await fetch("/course/list");
      const jsonRes = await response.json();
      this.setState({ courses: jsonRes, apiDataLoaded: true });
      console.log(jsonRes);
    } catch (error) {
      console.log("Error retrieving courses!");
      console.log(error);
    }
  }

  createCourse = async (course, index) => {
    try {
      const newCourseResponse = await fetch(`/course`, {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          name: course.name,
          code: course.code
        })
      });
      const jsonRes = await newCourseResponse.json();
      const updatedCoursesList = [...this.state.courses];
      updatedCoursesList.push(jsonRes);
      this.setState({ courses: updatedCoursesList });
    } catch (error) {
      console.log("Error creating new Course!");
      console.log(error);
    }
  };

  deleteCourse = async (course, index) => {
    try {
      await fetch(`/course/delete/${course.id}`, {
        method: "delete",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          code: course.code,
          name: course.name
        })
      });
      let courses = this.state.courses;
      courses.splice(index, 1);
      this.setState({
        courses
      });
    } catch (error) {
      console.log("Error deleting Course!");
      console.log(error);
    }
  };

  render() {
    return (
      <div>
        <h1>Courses</h1>
        <CourseNewForm createCourse={this.createCourse} />
        {this.state.courses.map((course, index) => {
          return (
            <Course
              deleteCourse={() => this.deleteCourse(course, index)}
              {...course}
              key={index}
            />
          );
        })}
      </div>
    );
  }
}

export default CoursesList;
