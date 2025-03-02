import { Formik } from 'formik';
import { useNavigate } from 'react-router';
import { registerUser } from '../services/user';

const Login = () => {
  const navigate=useNavigate();

  return (
  <div>
    <Formik
      initialValues={{ username: ''}}
      validate={values => {
        const errors:Record<string,string> = {};
        if (!values.username) {
          errors.username = 'Required';
        } else if (
         values.username.length<3
        ) {
          errors.username = 'Username must be greater than 3 characters';
        }
        return errors;
      }}
      onSubmit={async(values, { setSubmitting }) => {
        const response=await registerUser(values.username)
        setTimeout(() => {
          navigate('/',{state:values.username})
          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
          />
          {errors.username && touched.username && errors.username}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
    </Formik>
  </div>
)};

export default Login;