
import { useRef, useState } from 'react';
import { Send, FileText, X } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialValues = {
  name: '',
  email: '',
  phone: '',
  position: '',
  qualification: '',
  experience_years: '',
  experience_months: '',
  current_company: '',
  linkedin_url: '',
  message: '',
};

export default function CareerApplicationForm() {
  const [values, setValues] = useState(initialValues);
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [notice, setNotice] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setNotice('');
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    setResume(null);
    setResumeError('');
    setNotice('');

    if (!file) return;

    const isPdf = file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf || (file.type && file.type !== 'application/pdf')) {
      setResumeError('Please upload a valid PDF file only.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setResumeError('Your resume must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setResume(file);
  };

  const removeResume = () => {
    setResume(null);
    setResumeError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice('');

    if (!resume) {
      setResumeError('Please attach your resume in PDF format.');
      return;
    }

    // API integration will be implemented in the next phase.
    setNotice(
      'The application form is ready, but submission is not enabled yet. Your details have not been sent or stored.'
    );
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="formgrid">
        <label className="full">
          Full name *
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            maxLength={150}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />
        </label>

        <label>
          Email address *
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            maxLength={254}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label>
          Mobile number *
          <input
            type="tel"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            maxLength={20}
            placeholder="Enter mobile number"
            autoComplete="tel"
            required
          />
        </label>

        <label>
          Position applying for
          <input
            type="text"
            name="position"
            value={values.position}
            onChange={handleChange}
            maxLength={150}
            placeholder="e.g. Company Secretary"
          />
        </label>

        <label>
          Highest qualification *
          <input
            type="text"
            name="qualification"
            value={values.qualification}
            onChange={handleChange}
            maxLength={200}
            placeholder="e.g. CS, CA, LLB"
            required
          />
        </label>

        <label>
          Experience — years *
          <input
            type="number"
            name="experience_years"
            value={values.experience_years}
            onChange={handleChange}
            min={0}
            max={50}
            step={1}
            placeholder="Years"
            required
          />
        </label>

        <label>
          Experience — months *
          <input
            type="number"
            name="experience_months"
            value={values.experience_months}
            onChange={handleChange}
            min={0}
            max={11}
            step={1}
            placeholder="Months"
            required
          />
        </label>

        <label>
          Current / last company
          <input
            type="text"
            name="current_company"
            value={values.current_company}
            onChange={handleChange}
            maxLength={200}
            placeholder="Company name"
          />
        </label>

        <label>
          LinkedIn profile
          <input
            type="url"
            name="linkedin_url"
            value={values.linkedin_url}
            onChange={handleChange}
            maxLength={500}
            placeholder="https://linkedin.com/in/..."
          />
        </label>

        <label className="full">
          Additional message
          <textarea
            name="message"
            value={values.message}
            onChange={handleChange}
            maxLength={5000}
            rows={4}
            placeholder="Tell us more about yourself..."
          />
        </label>

        <label className="full">
          Resume (PDF only, maximum 5 MB) *
          <input
            ref={fileInputRef}
            type="file"
            name="resume"
            accept=".pdf,application/pdf"
            onChange={handleResumeChange}
            required={!resume}
          />

          {resume && (
            <span className="career-file">
              <FileText size={16} />
              <span>{resume.name}</span>
              <button
                type="button"
                onClick={removeResume}
                aria-label="Remove resume"
              >
                <X size={15} />
              </button>
            </span>
          )}

          {resumeError && (
            <span className="field-error" role="alert">
              {resumeError}
            </span>
          )}

          <small className="formnote">
            Upload your latest resume in PDF format. Maximum file size: 5 MB.
          </small>
        </label>
      </div>

      {notice && (
        <div className="form-alert" role="status" aria-live="polite">
          {notice}
        </div>
      )}

      <button className="btn primary" type="submit">
        Submit application <Send size={16} />
      </button>

      <small className="formnote">
        Your application details and resume will be handled securely.
      </small>
    </form>
  );
}
