import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiCoffee, FiMoon, FiStar, FiMapPin, FiHome, FiInfo, FiTruck, FiDollarSign, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const SectionBlock = ({ icon, label, content, color }) => {
  if (!content) return null;
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        borderRadius: 12,
        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, color,
        marginTop: 2, border: `1px solid ${color}30`
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          {label}
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
          {content}
        </p>
      </div>
    </div>
  );
};

const DayCard = ({ day, index }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      style={{
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        boxShadow: isExpanded ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Day Header (Clickable) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '16px 20px',
          background: isExpanded ? 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)' : 'transparent',
          borderBottom: isExpanded ? '1px solid var(--border-subtle)' : '1px solid transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', transition: 'all 0.3s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 40, height: 40,
            background: 'var(--gradient-brand)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', fontWeight: 800, color: 'white',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
          }}>
            {day.day}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', fontFamily: 'var(--font-display)' }}>
              {day.title || `Day ${day.day}`}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              {day.date && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{day.date}</span>
              )}
              {day.theme && (
                <>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-subtle)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--brand-tertiary)', fontWeight: 600 }}>{day.theme}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
        }}>
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </div>

      {/* Day Content (Animated Accordion) */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
              <SectionBlock icon={<FiCoffee />} label="Morning" content={day.morning} color="var(--warning)" />
              <SectionBlock icon={<FiSun />} label="Afternoon" content={day.afternoon} color="var(--brand-accent)" />
              <SectionBlock icon={<FiMoon />} label="Evening" content={day.evening} color="var(--brand-secondary)" />
              {day.night && <SectionBlock icon={<FiMoon />} label="Night" content={day.night} color="#7c3aed" />}

              {/* Info Grid row */}
              {(day.accommodation || day.transport || day.estimatedCost || (day.meals && day.meals.length > 0)) && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16,
                  paddingTop: 16, marginTop: 8, borderTop: '1px dashed var(--border-subtle)',
                }}>
                  {day.accommodation && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <FiHome size={16} style={{ color: 'var(--brand-accent-2)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Stay</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>{day.accommodation}</div>
                      </div>
                    </div>
                  )}
                  {day.transport && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <FiTruck size={16} style={{ color: 'var(--info)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Transport</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>{day.transport}</div>
                      </div>
                    </div>
                  )}
                  {day.estimatedCost && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <FiDollarSign size={16} style={{ color: 'var(--success)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Daily Budget</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>{day.estimatedCost}</div>
                      </div>
                    </div>
                  )}
                  {day.meals && day.meals.length > 0 && (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 4 }}>
                      <FiCoffee size={16} style={{ color: 'var(--warning)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 8 }}>Meal Recommendations</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {day.meals.map((meal, i) => (
                            <span key={i} style={{
                              padding: '4px 10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                              borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 500,
                            }}>
                              {meal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Highlights */}
              {day.highlights && day.highlights.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                  {day.highlights.map((h, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
                      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--brand-tertiary)', fontWeight: 500
                    }}>
                      <FiStar size={12} /> {h}
                    </span>
                  ))}
                </div>
              )}

              {/* Tip */}
              {day.tips && (
                <div style={{
                  display: 'flex', gap: 10, padding: '12px 16px', marginTop: 16,
                  background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <FiInfo size={16} style={{ color: 'var(--info)', flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--info)', margin: 0, fontWeight: 500 }}>{day.tips}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ItineraryView = ({ itinerary, isPublic = false }) => {
  if (!itinerary) return null;

  const {
    destination, origin, duration, summary, highlights,
    days, essentials, travelTips, estimatedBudget,
    bestTimeToVisit, currency, language, timezone,
  } = itinerary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
      {/* Hero Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(6,182,212,0.08) 100%)',
          border: '1px solid var(--border-brand)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-xl)',
          position: 'relative', overflow: 'hidden'
        }}
      >
        {/* Decorative orb */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'var(--brand-primary)', filter: 'blur(80px)', opacity: 0.2 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <FiMapPin style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {origin && `${origin} → `}{destination}
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', margin: 0, fontFamily: 'var(--font-display)', background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Your Trip to {destination}
              </h2>
            </div>
            {duration && (
              <div style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>
                {duration}
              </div>
            )}
          </div>

          {summary && (
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 var(--space-xl)', lineHeight: 1.8, fontSize: '1.05rem', maxWidth: '90%' }}>
              {summary}
            </p>
          )}

          {/* Quick info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            {[
              { label: 'Estimated Budget', value: estimatedBudget },
              { label: 'Best Time to Visit', value: bestTimeToVisit },
              { label: 'Currency', value: currency },
              { label: 'Primary Language', value: language },
              { label: 'Timezone', value: timezone },
            ].filter(i => i.value).map(item => (
              <div key={item.label} style={{
                padding: '12px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Highlights */}
      {highlights && highlights.length > 0 && (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--warning)' }}>✨</span> Trip Highlights
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {highlights.map((h, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px',
                background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
              }}>
                <FiStar size={16} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>{h}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Day-by-Day */}
      {days && days.length > 0 && (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--brand-primary)' }}>🗓️</span> Day-by-Day Itinerary
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 6 }}>
              {days.length} days
            </span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {days.map((day, i) => <DayCard key={i} day={day} index={i} />)}
          </div>
        </motion.div>
      )}

      {/* Bottom grid: Essentials + Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', marginTop: 'var(--space-md)' }}>
        {essentials && essentials.length > 0 && (
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{
            padding: 'var(--space-xl)', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-xl)',
          }}>
            <h4 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--brand-accent)' }}>
              🎒 Packing Essentials
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
              {essentials.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <span style={{ color: 'var(--brand-accent)', fontSize: '0.7rem' }}>✓</span>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {travelTips && travelTips.length > 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{
            padding: 'var(--space-xl)', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-xl)',
          }}>
            <h4 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--info)' }}>
              💡 Expert Travel Tips
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
              {travelTips.map((tip, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <span style={{ color: 'var(--info)', fontSize: '0.8rem' }}>→</span>
                  </div>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ItineraryView;
