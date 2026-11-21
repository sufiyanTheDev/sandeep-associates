
import { useRef, useState } from 'react';
import { Send, FileText, X } from 'lucide-react';
import { API_BASE_URL } from './admin-api';

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

function getErrorMessage(data, status) {
  const detail = data?.detail;

  if (typeof detail === 'string') return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg || 'Please check your entries.')
      .join(' ');
  }

  if (status === 413) {
    return 'Your resume is too large. Please upload a PDF of 5 MB or less.';
  }

  return 'We could not submit your application. Please try again.';
}

export default function CareerApplicationForm() {
  const [values, setValues] = useState(initialValues);
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('error');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const submittingRef = useRef(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submittingRef.current) return;

    setNotice('');
    setResumeError('');

    if (!resume) {
      setResumeError('Please attach your resume in PDF format.');
      return;
    }

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value.trim());
    });

    formData.set(
      'experience_years',
      String(Number(values.experience_years))
    );

    formData.set(
      'experience_months',
      String(Number(values.experience_months))
    );

    formData.append('resume', resume, resume.name);

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/career-applications`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getErrorMessage(data, response.status));
      }

      setValues(initialValues);
      setResume(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setNotice(
        data?.message ||
        'Your application has been submitted successfully.'
      );

      setNoticeType('success');
    } catch (error) {
      setNotice(
        error instanceof TypeError
          ? 'We could not connect to the application service. Please try again in a moment.'
          : error.message || 'We could not submit your application. Please try again.'
      );

      setNoticeType('error');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
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
            maxLength={30}
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
            Upload your latest resume in PDF format.
            Maximum file size: 5 MB.
          </small>
        </label>
      </div>

      {notice && (
        <div
          className={`form-alert ${
            noticeType === 'success' ? 'form-alert-success' : ''
          }`}
          role={noticeType === 'success' ? 'status' : 'alert'}
          aria-live="polite"
        >
          {notice}
        </div>
      )}

      <button
        className="btn primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? 'Submitting application…'
          : 'Submit application'}

        <Send size={16} />
      </button>

      <small className="formnote">
        Your application details and resume will be handled securely.
      </small>
    </form>
  );
}
