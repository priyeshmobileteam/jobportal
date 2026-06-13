import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Profile } from '../../types';
import { User, Mail, Phone, Code, FileCode, Award, CheckCircle2, RefreshCw } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [skills, setSkills] = useState('');

  // Recruiter fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [industry, setIndustry] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/profiles/me');
      const data = response.data as Profile;
      setProfile(data);

      // Populate forms
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setPhoneNumber(data.phoneNumber || '');
      setHeadline(data.headline || '');
      setBio(data.bio || '');
      setCurrentLocation(data.currentLocation || '');
      setExpectedSalary(data.expectedSalary?.toString() || '');
      setResumeUrl(data.resumeUrl || '');
      setPortfolioUrl(data.portfolioUrl || '');
      setSkills(data.skills?.join(', ') || '');

      setCompanyName(data.companyName || '');
      setCompanyWebsite(data.companyWebsite || '');
      setCompanyDescription(data.companyDescription || '');
      setCompanyAddress(data.companyAddress || '');
      setIndustry(data.industry || '');
    } catch (e) {
      console.error('Failed to load profile', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const skillsArray = skills
        ? skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
        : [];

      const payload = {
        firstName,
        lastName,
        phoneNumber,
        headline,
        bio,
        currentLocation,
        expectedSalary: expectedSalary ? parseFloat(expectedSalary) : undefined,
        resumeUrl,
        portfolioUrl,
        skills: skillsArray,
        companyName,
        companyWebsite,
        companyDescription,
        companyAddress,
        industry,
      };

      const response = await api.put('/profiles/me', payload);
      setProfile(response.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-indigo-500 font-semibold">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading profile details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Profile Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure credentials and resume builder</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      {success && (
        <div className="p-4 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {success}
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 rounded-2xl">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleUpdate} className="p-8 glass-panel rounded-3xl space-y-6 bg-white/60 dark:bg-slate-900/60 shadow-xl">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-white pb-3 border-b border-slate-200/20">Edit Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
            />
          </div>

          {/* Candidate-specific edit panel */}
          {profile?.skills !== undefined ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Full Stack Engineer"
                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Location</label>
                  <input
                    type="text"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    placeholder="San Francisco, CA"
                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Expected Salary ($)</label>
                  <input
                    type="number"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="100000"
                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Portfolio Website</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://portfolio.me"
                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Resume link / PDF URL</label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/your-resume.pdf"
                  className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Java, React, PostgreSQL, Spring Boot"
                  className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white text-sm"
                />
              </div>
            </>
          ) : (
            /* Recruiter-specific edit panel */
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company Website</label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://acme.com"
                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Address</label>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company Description</label>
                <textarea
                  rows={4}
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white text-sm"
                />
              </div>
            </>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-1/2 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        /* Read-only profile view */
        <div className="p-8 glass-panel rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-indigo-purple flex items-center justify-center text-white font-black text-2xl animate-float">
              {profile?.firstName?.charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white">
                {profile?.firstName} {profile?.lastName}
              </h3>
              {profile?.headline && (
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{profile.headline}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200/20 text-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Mail className="w-5 h-5 text-indigo-500" />
                <span>Email Address:</span>
                <span className="font-bold text-slate-800 dark:text-white">{profile?.companyWebsite || 'Mock Email Configured'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Phone className="w-5 h-5 text-indigo-500" />
                <span>Phone Number:</span>
                <span className="font-bold text-slate-800 dark:text-white">{profile?.phoneNumber || 'None'}</span>
              </div>
            </div>

            {profile?.currentLocation && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <User className="w-5 h-5 text-indigo-500" />
                  <span>Current Location:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{profile.currentLocation}</span>
                </div>
              </div>
            )}
          </div>

          {/* Candidate Profile skills & bio */}
          {profile?.skills !== undefined && (
            <>
              {profile.bio && (
                <div className="pt-6 border-t border-slate-200/20">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">About Me</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{profile.bio}"
                  </p>
                </div>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div className="pt-6 border-t border-slate-200/20">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Core Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl flex items-center gap-1 border border-indigo-100/10"
                      >
                        <Code className="w-3.5 h-3.5" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Recruiter profile company description */}
          {profile?.companyName && (
            <div className="pt-6 border-t border-slate-200/20 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Company Description</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  {profile.companyDescription || 'No description provided.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                <span>Industry: <span className="text-slate-800 dark:text-white font-bold">{profile.industry || 'N/A'}</span></span>
                <span>Website: <span className="text-indigo-500 font-bold underline"><a href={profile.companyWebsite} target="_blank" rel="noreferrer">{profile.companyWebsite || 'N/A'}</a></span></span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ProfileView;
