import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../../redux/auth/operations";
import css from "./LoginForm.module.css";
import Container from "../Container/Container";
import { useState } from "react";  
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .max(50, "Email must be at most 50 characters")
    .required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be at most 50 characters")
    .required("Required"),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = async (values, { resetForm }) => {
    const result = await dispatch(login(values));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
    resetForm();
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Container variant="white">
          <Form className={css.container}>
            <h2 className={css.title}>Login</h2>

            <div className={css.form}>
              <label className={css.label}>
                <span className={css.text}>Enter your email address</span>
                <Field
                  name="email"
                  type="email"
                  placeholder="email@gmail.com"
                  className={`${css.input} ${
                    errors.email && touched.email ? css.inputError : ""
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={css.error}
                />
              </label>

              <label className={css.label}>
                <span className={css.text}>Enter your password</span>
                <div className={css.passWrapper}>
                  <Field
                    name="password"
                    type="password"
                    placeholder="********"
                    className={`${css.input} ${
                      errors.password && touched.password ? css.inputError : ""
                    }`}
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className={css.toggleBtn}
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className={css.error}
                />
              </label>

              <button type="submit" className={css.button}>
                Login
              </button>
            </div>

            <p className={css.titlehint}>
              Don’t have an account?{" "}
              <Link to="/auth/register" className={css.link}>
                Register
              </Link>
            </p>
          </Form>
        </Container>
      )}
    </Formik>
  );
}
