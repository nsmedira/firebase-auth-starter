import React from "react";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";

const Auth = ({ type = "signup", location }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const history = useHistory();

  const {
    signup,
    login,
    resetPassword,
    currentUser,
    updateEmail,
    updatePassword,
  } = useAuth();

  const {
    values,
    initialValues,
    errors,
    isValid,
    setFieldValue,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      type,
      email: type === "update" ? currentUser.email : "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object().shape({
      type: yup.string(),
      email: yup
        .string()
        .email("Must be a valid email address.")
        .required("Email is required"),
      password: yup.string().when("type", {
        is: "forgot-password",
        then: yup.string().nullable(),
        otherwise: yup.string().when("type", {
          is: "update",
          then: yup.string().when("confirmPassword", {
            is: (val) => !val,
            then: yup.string().nullable(),
            otherwise: yup.string().required("Password is required"),
          }),
          otherwise: yup.string().required("Password is required"),
        }),
      }),
      confirmPassword: yup.string().when("type", {
        is: (val) => val === "signup" || val === "update",
        then: yup
          .string()
          .oneOf([yup.ref("password"), null], "Passwords must match")
          .when("password", {
            is: (val) => !!val,
            then: yup.string().required("Please confirm password"),
            otherwise: yup.string(),
          }),
        otherwise: yup.string().nullable(),
      }),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (type === "signup") {
          await signup(values.email, values.password);
        } else if (type === "login") {
          await login(values.email, values.password);
        } else if (type === "forgot-password") {
          await resetPassword(values.email);
        } else if (type === "update") {
          if (initialValues.email !== values.email) {
            await updateEmail(values.email);
            toast.success(
              `Your email address has been updated to ${values.email}`
            );
          }
          if (!!values.password) {
            await updatePassword(values.password);
            toast.success("Your password has been updated");
          }
        }

        if (!!location.state?.nextPath) {
          history.push(location.state.nextPath);
        } else if (type === "signup" || type === "login" || type === "update") {
          history.push("/"); // go to dashboard
        } else if (type === "forgot-password") {
          history.push("/login");
          toast.success("Check your email for password recovery instructions");
        }
      } catch (e) {
        let error;
        if (e.code === "auth/user-not-found") {
          error = `A user with email ${values.email} does not exist`;
        } else if (e.code === "auth/requires-recent-login") {
          error = "Please login to proceed";
          history.push("/login", { nextPath: "/update-profile" });
        } else if (!!e.code) {
          error = e.code;
        } else {
          error = e.message;
        }
        toast.error(error);
      }

      setIsLoading(false);
    },
  });

  React.useEffect(() => {
    setFieldValue("type", type);
  }, [setFieldValue, type]);
  const label = (
    <>
      {type === "signup" && "Sign Up"}
      {type === "login" && "Log In"}
      {type === "forgot-password" && "Reset Password"}
      {type === "update" && "Update Profile"}
    </>
  );

  let linkTo;
  if (type === "signup" || type === "forgot-password") {
    linkTo = "/login";
  } else if (type === "login") {
    linkTo = "/signup";
  } else if (type === "update") {
    linkTo = "/";
  }

  const passwordPlaceholder =
    type === "update" ? "Leave blank to keep same password" : undefined;

  return (
    <>
      <Card>
        <Card.Body>
          <Header heading={label} />
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={values.email}
                isInvalid={errors.email}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            {type !== "forgot-password" && (
              <Form.Group id="password" className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  value={values.password}
                  isInvalid={errors.password}
                  onChange={handleChange}
                  placeholder={passwordPlaceholder}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {(type === "signup" || type === "update") && (
              <Form.Group id="password-confirm" className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  isInvalid={errors.confirmPassword}
                  onChange={handleChange}
                  placeholder={passwordPlaceholder}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            <Button
              className="w-100"
              type="submit"
              disabled={isLoading || !isValid}
            >
              {label}
            </Button>
          </Form>
          {type === "login" && (
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          )}
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        {type !== "update" && (
          <>
            {type === "signup" && "Already have an account?"}
            {type === "login" && "Need an account?"}
            {type === "forgot-password" && "Back to"}{" "}
          </>
        )}
        <Link to={linkTo}>
          <>
            {type === "login" && "Sign Up"}
            {(type === "signup" || type === "forgot-password") && "Log In"}
            {type === "update" && "Cancel"}
          </>
        </Link>
      </div>
    </>
  );
};

export default Auth;
