import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { skillService } from '../../services/skillService';
import type { StudentProfile, Skill } from '../../types/student';
import { SkillGapView } from '../../components/students/SkillGapView';
import { CareerPredictorView } from '../../components/students/CareerPredictorView';
import { RoadmapView } from '../../components/students/RoadmapView';
import { 
  Sparkles, 
  Target, 
  Award, 
  Compass, 
  BookOpen,
  Plus, 
  Trash2, 
  FolderGit2, 
  FileCheck2, 
  ExternalLink,
  Edit3
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'skillgap' | 'career' | 'roadmap'>('overview');

  // Skill Modal State
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<number | ''>('');
  const [proficiencyLevel, setProficiencyLevel] = useState<number>(3);
  const [experienceMonths, setExperienceMonths] = useState<number>(6);
  const [evidenceProject, setEvidenceProject] = useState('');

  // Project Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectGithub, setProjectGithub] = useState('');

  // Certification Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [certName, setCertName] = useState('');
  const [certOrg, setCertOrg] = useState('');
  const [certUrl, setCertUrl] = useState('');

  // Target Role State
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [targetRole, setTargetRole] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [profData, skillsData] = await Promise.all([
        studentService.getMyProfile(),
        skillService.getAllSkills(),
      ]);
      setProfile(profData);
      setAvailableSkills(skillsData);
      setTargetRole(profData.targetCareerRole || 'Java Full Stack Developer');
    } catch (err) {
      console.error('Failed to load profile data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    try {
      await studentService.addOrUpdateSkill({
        skillId: Number(selectedSkillId),
        proficiencyLevel,
        experienceMonths,
        evidenceProject,
      });
      setShowSkillModal(false);
      setSelectedSkillId('');
      setEvidenceProject('');
      await loadData();
    } catch (err) {
      alert('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    if (!confirm('Remove this skill from your profile?')) return;
    try {
      await studentService.deleteSkill(skillId);
      await loadData();
    } catch (err) {
      alert('Failed to delete skill');
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle) return;

    try {
      await studentService.addProject({
        title: projectTitle,
        description: projectDesc,
        technologiesUsed: projectTech,
        githubUrl: projectGithub,
      });
      setShowProjectModal(false);
      setProjectTitle('');
      setProjectDesc('');
      setProjectTech('');
      setProjectGithub('');
      await loadData();
    } catch (err) {
      alert('Failed to add project');
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName) return;

    try {
      await studentService.addCertification({
        name: certName,
        issuingOrganization: certOrg,
        credentialUrl: certUrl,
      });
      setShowCertModal(false);
      setCertName('');
      setCertOrg('');
      setCertUrl('');
      await loadData();
    } catch (err) {
      alert('Failed to add certification');
    }
  };

  const handleSaveRole = async () => {
    try {
      await studentService.updateProfile({ targetCareerRole: targetRole });
      setIsEditingRole(false);
      await loadData();
    } catch (err) {
      alert('Failed to update target career role');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const technicalSkills = profile?.skills.filter((s) => s.category !== 'SOFT_SKILL') || [];
  const softSkills = profile?.skills.filter((s) => s.category === 'SOFT_SKILL') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md">
            Student Profile & Skills
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
            {profile?.firstName} {profile?.lastName}
          </h1>
          <p className="mt-2 text-indigo-100 text-sm">
            {profile?.departmentName} • Roll No: {profile?.rollNumber || 'N/A'} • CGPA: {profile?.cgpa || '8.5'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {isEditingRole ? (
            <div className="flex items-center space-x-2 bg-white/10 p-1.5 rounded-xl">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Target Role"
                className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-semibold focus:outline-none"
              />
              <button
                onClick={handleSaveRole}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <Compass className="h-4 w-4 text-sky-300" />
              <span className="text-xs font-bold">{profile?.targetCareerRole || 'Java Full Stack Developer'}</span>
              <button
                onClick={() => setIsEditingRole(true)}
                className="p-1 hover:text-indigo-200 transition cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Skills</p>
              <h3 className="mt-2 text-3xl font-black text-slate-900">{profile?.skills.length || 0}</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600">{technicalSkills.length} Technical • {softSkills.length} Soft</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Projects</p>
              <h3 className="mt-2 text-3xl font-black text-sky-600">{profile?.projects.length || 0}</h3>
            </div>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <FolderGit2 className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600">Portfolio & Academic Work</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certifications</p>
              <h3 className="mt-2 text-3xl font-black text-emerald-600">{profile?.certifications.length || 0}</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileCheck2 className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600">Verified Credentials</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill Matching</p>
              <h3 className="mt-2 text-3xl font-black text-indigo-600">Ready</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600">Phase 9 AI Engine Target</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 font-semibold text-sm transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Profile Overview & Skills
        </button>
        <button
          onClick={() => setActiveTab('skillgap')}
          className={`pb-3 font-semibold text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'skillgap'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          AI Skill Gap Analysis
        </button>
        <button
          onClick={() => setActiveTab('career')}
          className={`pb-3 font-semibold text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'career'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-600" />
          AI Career Prediction
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`pb-3 font-semibold text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'roadmap'
              ? 'border-b-2 border-violet-600 text-violet-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-violet-600" />
          Personalized Roadmap
        </button>
      </div>

      {activeTab === 'skillgap' ? (
        <SkillGapView />
      ) : activeTab === 'career' ? (
        <CareerPredictorView />
      ) : activeTab === 'roadmap' ? (
        <RoadmapView />
      ) : (
        <>
          {/* Main Grid: Skills Management */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Technical & Soft Skills */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Technical & Professional Competencies</h3>
                <p className="text-xs text-slate-500">Standardized 1-5 proficiency scale (1=Beginner, 5=Expert)</p>
              </div>
              <button
                onClick={() => setShowSkillModal(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center transition cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </button>
            </div>

            {profile?.skills.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <Target className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No skills added yet</p>
                <p className="text-xs text-slate-500 mt-1">Add your programming, database, and frameworks to begin matching.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile?.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {skill.category.replace('_', ' ')}
                        </span>
                        <h4 className="font-bold text-slate-900 mt-1 text-base">{skill.skillName}</h4>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                        title="Delete skill"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span className="font-medium">Proficiency</span>
                        <span className="font-bold text-indigo-700">Level {skill.proficiencyLevel} / 5</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div
                            key={lvl}
                            className={`h-2 flex-1 rounded-full ${
                              lvl <= skill.proficiencyLevel ? 'bg-indigo-600' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Portfolio Projects</h3>
                <p className="text-xs text-slate-500">Showcase software projects demonstrating applied skills</p>
              </div>
              <button
                onClick={() => setShowProjectModal(true)}
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center transition cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Project
              </button>
            </div>

            {profile?.projects.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                <FolderGit2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No projects added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {profile?.projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-600 hover:underline flex items-center"
                        >
                          Code <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                    {proj.description && <p className="text-xs text-slate-600 mt-1">{proj.description}</p>}
                    {proj.technologiesUsed && (
                      <span className="inline-block mt-2 text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {proj.technologiesUsed}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Certifications & Academic Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Certifications</h3>
                <p className="text-xs text-slate-500">Verified credentials</p>
              </div>
              <button
                onClick={() => setShowCertModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </button>
            </div>

            {profile?.certifications.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                <FileCheck2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No certifications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {profile?.certifications.map((cert) => (
                  <div key={cert.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                    <h5 className="font-bold text-slate-900 text-xs">{cert.name}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cert.issuingOrganization || 'Verified'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-sky-50 p-6 rounded-2xl border border-indigo-100">
            <h4 className="text-sm font-bold text-indigo-950 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-indigo-600" />
              Next Step: Industry Matching
            </h4>
            <p className="mt-2 text-xs text-indigo-900/80 leading-relaxed">
              In Phase 6 & Phase 7, recruiters post jobs and internships with specific skill weights. SkillBridge will calculate weighted match percentages against your competencies.
            </p>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add or Update Skill</h3>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Skill</label>
                <select
                  required
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                >
                  <option value="">-- Choose a standard skill --</option>
                  {availableSkills.map((sk) => (
                    <option key={sk.id} value={sk.id}>
                      {sk.name} ({sk.category.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                  <span>Proficiency Level (1 to 5)</span>
                  <span className="text-indigo-600 font-bold">Level {proficiencyLevel}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={proficiencyLevel}
                  onChange={(e) => setProficiencyLevel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 (Beginner)</span>
                  <span>3 (Intermediate)</span>
                  <span>5 (Expert)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Months)</label>
                <input
                  type="number"
                  min="0"
                  value={experienceMonths}
                  onChange={(e) => setExperienceMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. SkillBridge AI Platform"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Technologies Used</label>
                <input
                  type="text"
                  value={projectTech}
                  onChange={(e) => setProjectTech(e.target.value)}
                  placeholder="Java, Spring Boot, React, PostgreSQL"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Brief overview of features and architecture..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Repository Link</label>
                <input
                  type="url"
                  value={projectGithub}
                  onChange={(e) => setProjectGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Certification Modal */}
      {showCertModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Certification</h3>
            <form onSubmit={handleAddCert} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Certification Name</label>
                <input
                  type="text"
                  required
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={certOrg}
                  onChange={(e) => setCertOrg(e.target.value)}
                  placeholder="Amazon Web Services, Oracle, Coursera"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Credential URL</label>
                <input
                  type="url"
                  value={certUrl}
                  onChange={(e) => setCertUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                >
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
