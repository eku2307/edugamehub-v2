import React, { useState } from 'react';
import { BarChart3, Users, Clock, Target, TrendingUp, Award, Calendar, Filter } from 'lucide-react';

const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState('week');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const [students] = useState([
    { 
      id: 1, 
      name: 'Alex Johnson', 
      email: 'alex.j@school.edu',
      totalScore: 850, 
      physics: 78, 
      chemistry: 82, 
      math: 90, 
      biology: 75, 
      lastActive: '2 hours ago',
      gamesCompleted: 12,
      timeSpent: 45,
      streak: 5
    },
    { 
      id: 2, 
      name: 'Sarah Wilson', 
      email: 'sarah.w@school.edu',
      totalScore: 920, 
      physics: 85, 
      chemistry: 88, 
      math: 92, 
      biology: 80, 
      lastActive: '1 hour ago',
      gamesCompleted: 15,
      timeSpent: 52,
      streak: 8
    },
    { 
      id: 3, 
      name: 'Mike Chen', 
      email: 'mike.c@school.edu',
      totalScore: 760, 
      physics: 70, 
      chemistry: 75, 
      math: 85, 
      biology: 68, 
      lastActive: '4 hours ago',
      gamesCompleted: 9,
      timeSpent: 38,
      streak: 3
    },
    { 
      id: 4, 
      name: 'Emma Davis', 
      email: 'emma.d@school.edu',
      totalScore: 1100, 
      physics: 95, 
      chemistry: 90, 
      math: 88, 
      biology: 92, 
      lastActive: '30 mins ago',
      gamesCompleted: 18,
      timeSpent: 65,
      streak: 12
    },
    { 
      id: 5, 
      name: 'David Brown', 
      email: 'david.b@school.edu',
      totalScore: 680, 
      physics: 65, 
      chemistry: 70, 
      math: 72, 
      biology: 60, 
      lastActive: '1 day ago',
      gamesCompleted: 7,
      timeSpent: 28,
      streak: 1
    },
    { 
      id: 6, 
      name: 'Lisa Garcia', 
      email: 'lisa.g@school.edu',
      totalScore: 950, 
      physics: 88, 
      chemistry: 85, 
      math: 94, 
      biology: 87, 
      lastActive: '3 hours ago',
      gamesCompleted: 14,
      timeSpent: 48,
      streak: 6
    }
  ]);

  const getOverallStats = () => {
    const totalStudents = students.length;
    const averageScore = Math.round(students.reduce((sum, student) => sum + student.totalScore, 0) / totalStudents);
    const activeToday = students.filter(s => s.lastActive.includes('hour') || s.lastActive.includes('min')).length;
    const totalGamesCompleted = students.reduce((sum, student) => sum + student.gamesCompleted, 0);
    const averageCompletion = Math.round((totalGamesCompleted / (totalStudents * 20)) * 100); // 20 total games per student
    const totalTimeSpent = students.reduce((sum, student) => sum + student.timeSpent, 0);

    return {
      totalStudents,
      averageScore,
      activeToday,
      averageCompletion,
      totalTimeSpent
    };
  };

  const getTopPerformers = () => {
    return [...students]
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 3);
  };

  const getSubjectAverages = () => {
    return {
      physics: Math.round(students.reduce((sum, s) => sum + s.physics, 0) / students.length),
      chemistry: Math.round(students.reduce((sum, s) => sum + s.chemistry, 0) / students.length),
      math: Math.round(students.reduce((sum, s) => sum + s.math, 0) / students.length),
      biology: Math.round(students.reduce((sum, s) => sum + s.biology, 0) / students.length)
    };
  };

  const stats = getOverallStats();
  const topPerformers = getTopPerformers();
  const subjectAverages = getSubjectAverages();

  const filteredStudents = selectedSubject === 'all' 
    ? students 
    : students.filter(student => student[selectedSubject] >= 80);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)', 
            margin: '0 0 0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <BarChart3 size={32} />
            Teacher Analytics Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            Monitor student progress and performance across all subjects
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="form-input"
            style={{ minWidth: '120px' }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
          </select>
          
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="form-input"
            style={{ minWidth: '140px' }}
          >
            <option value="all">All Subjects</option>
            <option value="physics">Physics Only</option>
            <option value="chemistry">Chemistry Only</option>
            <option value="math">Math Only</option>
            <option value="biology">Biology Only</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="card-grid cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'var(--analytics-bg)', border: '1px solid var(--analytics-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--analytics-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Total Students
              </h3>
              <p style={{ color: 'var(--analytics-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {stats.totalStudents}
              </p>
              <p style={{ color: 'var(--analytics-text)', fontSize: '0.75rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>
                Active learners
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--analytics-accent)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--analytics-text)'
            }}>
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--physics-bg)', border: '1px solid var(--physics-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--physics-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Average Score
              </h3>
              <p style={{ color: 'var(--physics-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {stats.averageScore}
              </p>
              <p style={{ color: 'var(--physics-text)', fontSize: '0.75rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>
                Class performance
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--physics-accent)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--physics-text)'
            }}>
              <Target size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--success-bg)', border: '1px solid var(--success-text)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--success-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Active Today
              </h3>
              <p style={{ color: 'var(--success-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {stats.activeToday}
              </p>
              <p style={{ color: 'var(--success-text)', fontSize: '0.75rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>
                Students online
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--success-text)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success-bg)'
            }}>
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-text)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--warning-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Avg Completion
              </h3>
              <p style={{ color: 'var(--warning-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {stats.averageCompletion}%
              </p>
              <p style={{ color: 'var(--warning-text)', fontSize: '0.75rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>
                Games completed
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--warning-text)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--warning-bg)'
            }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance & Top Performers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Subject Averages */}
        <div className="card">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: '1.5rem'
          }}>
            Subject Performance
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(subjectAverages).map(([subject, average]) => (
              <div key={subject}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    textTransform: 'capitalize'
                  }}>
                    {subject}
                  </span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600',
                    color: `var(--${subject}-text)`
                  }}>
                    {average}%
                  </span>
                </div>
                <div className="progress-container">
                  <div 
                    className={`progress-bar ${subject}`}
                    style={{ width: `${average}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="card">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Award size={20} />
            Top Performers
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topPerformers.map((student, index) => (
              <div key={student.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: index === 0 ? 'var(--success-bg)' : 'var(--bg-secondary)',
                borderRadius: '12px',
                border: index === 0 ? '1px solid var(--success-text)' : '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: index === 0 ? 'var(--success-text)' : 'var(--physics-accent)',
                  color: index === 0 ? 'var(--success-bg)' : 'var(--physics-text)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '700'
                }}>
                  #{index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600',
                    color: index === 0 ? 'var(--success-text)' : 'var(--text-primary)'
                  }}>
                    {student.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem',
                    color: index === 0 ? 'var(--success-text)' : 'var(--text-secondary)',
                    opacity: 0.8
                  }}>
                    {student.gamesCompleted} games • {student.streak} day streak
                  </div>
                </div>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700',
                  color: index === 0 ? 'var(--success-text)' : 'var(--physics-text)'
                }}>
                  {student.totalScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Performance Table */}
      <div className="card">
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          color: 'var(--text-primary)',
          marginBottom: '1.5rem'
        }}>
          Detailed Student Performance ({filteredStudents.length} students)
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: '600' }}>Student</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: '600' }}>Total Score</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--physics-text)', fontWeight: '600' }}>Physics</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--chemistry-text)', fontWeight: '600' }}>Chemistry</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--math-text)', fontWeight: '600' }}>Math</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--biology-text)', fontWeight: '600' }}>Biology</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: '600' }}>Games</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: '600' }}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {student.email}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontWeight: '700', fontSize: '1.125rem', color: 'var(--success-text)' }}>
                      {student.totalScore}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: student.physics >= 80 ? 'var(--success-bg)' : 'var(--warning-bg)',
                      color: student.physics >= 80 ? 'var(--success-text)' : 'var(--warning-text)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {student.physics}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: student.chemistry >= 80 ? 'var(--success-bg)' : 'var(--warning-bg)',
                      color: student.chemistry >= 80 ? 'var(--success-text)' : 'var(--warning-text)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {student.chemistry}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: student.math >= 80 ? 'var(--success-bg)' : 'var(--warning-bg)',
                      color: student.math >= 80 ? 'var(--success-text)' : 'var(--warning-text)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {student.math}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: student.biology >= 80 ? 'var(--success-bg)' : 'var(--warning-bg)',
                      color: student.biology >= 80 ? 'var(--success-text)' : 'var(--warning-text)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {student.biology}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                      {student.gamesCompleted}/20
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {student.timeSpent}h spent
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ 
                      color: student.lastActive.includes('hour') || student.lastActive.includes('min') ? 'var(--success-text)' : 'var(--text-secondary)',
                      fontSize: '0.875rem'
                    }}>
                      {student.lastActive}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--warning-text)' }}>
                      {student.streak} day streak
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;