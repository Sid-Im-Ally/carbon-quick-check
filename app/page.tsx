'use client';

import { useState, useCallback } from 'react';
import type { CarbonQuickCheckInput, CalculationResult } from '@/types/carbon';
import type { ResolvedLocation } from '@/types/location';
import type { KoppenClimateResult } from '@/types/climate';
import type { GridEmissionResult } from '@/types/grid';
import { DEFAULT_INFRA_ALLOWANCE_PERCENT } from '@/data/infrastructureAssumptions';
import { runCalculations } from '@/lib/calculations';

import SidebarNav, { type NavTab } from '@/components/dashboard/SidebarNav';
import OverviewHeader from '@/components/dashboard/OverviewHeader';
import Icon, { type IconName } from '@/components/dashboard/Icon';
import ProjectDetailsPanel from '@/components/dashboard/panels/ProjectDetailsPanel';
import BuildingProgramPanel from '@/components/dashboard/panels/BuildingProgramPanel';
import MobilityContextPanel from '@/components/dashboard/panels/MobilityContextPanel';
import GridEnergyPanel from '@/components/dashboard/panels/GridEnergyPanel';
import HeroCard from '@/components/dashboard/results/HeroVisualCard';
import BreakdownCard from '@/components/dashboard/results/EmissionsBreakdownPanel';
import MetricCard from '@/components/dashboard/results/MetricCard';
import ChartArea from '@/components/dashboard/results/ResultTabs';
import SignalsPanel from '@/components/dashboard/results/DesignSignalsPanel';
import AssumptionStrip from '@/components/dashboard/results/AssumptionSummaryStrip';

// ─── Types ────────────────────────────────────────────────────────────────────

type AccordionKey = 'project' | 'building' | 'mobility' | 'grid';

type PanelConfig = {
  key: AccordionKey;
  number: number;
  title: string;
  icon: IconName;
  iconBg: string;
  iconColor: string;
};

const PANELS: PanelConfig[] = [
  { key: 'project',  number: 1, title: 'Project Details',   icon: 'pin',      iconBg: '#eef0e8', iconColor: '#5a7a5a' },
  { key: 'building', number: 2, title: 'Building Program',  icon: 'building', iconBg: '#eef0e8', iconColor: '#5a7a5a' },
  { key: 'mobility', number: 3, title: 'Mobility Context',  icon: 'car',      iconBg: '#fdf3ea', iconColor: '#e8954a' },
  { key: 'grid',     number: 4, title: 'Grid & Energy',     icon: 'bulb',     iconBg: '#fbf3df', iconColor: '#c9a961' },
];

const INITIAL_FORM: Partial<CarbonQuickCheckInput> = {
  projectName: '',
  locationInput: '',
  totalPopulation:   undefined as unknown as number,
  totalBuiltAreaM2:  undefined as unknown as number,
  siteAreaValue:     undefined as unknown as number,
  siteAreaUnit: 'hectares',
  geographicContext: undefined,
  projectType:       undefined,
  programAreas: { residential: 0, office: 0, retail: 0, hospitality: 0, educational: 0, healthcare: 0, industrial: 0, institutional: 0 },
  residentialSplit:  { singleFamilyPercent: 30, multifamilyPercent: 70 },
  mobilityQuestionnaire: {
    parkingProvisionScore:    null as unknown as 0,
    transitAccessScore:       null as unknown as 0,
    mobilityCultureScore:     null as unknown as 0,
    catchmentTypeScore:       null as unknown as 0,
    expectedArrivalModeScore: null as unknown as 0,
  },
  infrastructureAllowancePercent: DEFAULT_INFRA_ALLOWANCE_PERCENT,
};

// ─── Accordion section ────────────────────────────────────────────────────────

type AccordionProps = PanelConfig & {
  expanded: boolean;
  onToggle: () => void;
  complete?: boolean;
  children: React.ReactNode;
};

function AccordionSection({ number, title, icon, iconBg, iconColor, expanded, onToggle, complete, children }: AccordionProps) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(31,38,34,0.07)', borderRadius: 10, marginBottom: 8 }}>
      <div
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer', borderBottom: expanded ? '1px solid rgba(31,38,34,0.06)' : 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#3d4a44', textTransform: 'uppercase' }}>
          <span style={{ width: 26, height: 26, borderRadius: 6, background: complete ? '#eef4ee' : iconBg, color: complete ? '#5a7a5a' : iconColor, display: 'grid', placeItems: 'center', border: complete ? '1px solid #d6e3d6' : 'none', flexShrink: 0 }}>
            {complete ? <Icon name="check" size={12} stroke={2.5} /> : <Icon name={icon} size={14} />}
          </span>
          {number}. {title}
        </div>
        <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color="#9aada4" />
      </div>
      {expanded && children}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ loading, error }: { loading: boolean; error?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center', gap: 12 }}>
      {loading ? (
        <>
          <div style={{ width: 36, height: 36, border: '3px solid rgba(90,122,90,0.2)', borderTopColor: '#5a7a5a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontSize: 13, color: '#6b7670', fontWeight: 500 }}>Calculating…</p>
        </>
      ) : error ? (
        <>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fef2f2', display: 'grid', placeItems: 'center' }}>
            <Icon name="bulb" size={20} color="#dc2626" />
          </div>
          <p style={{ fontSize: 13, color: '#dc2626' }}>{error}</p>
        </>
      ) : (
        <>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eef4ee', border: '1px solid #d6e3d6', display: 'grid', placeItems: 'center' }}>
            <Icon name="bars" size={22} color="#5a7a5a" stroke={1.5} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e3128', marginBottom: 4 }}>No results yet</p>
            <p style={{ fontSize: 12, color: '#9aada4', maxWidth: 240, lineHeight: 1.6 }}>
              Fill in the project details and building program, then click <strong style={{ color: '#5a7a5a' }}>Run Quick Check</strong>.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('overview');
  const [openSections, setOpenSections] = useState<Set<AccordionKey>>(new Set(['project']));
  const [formData, setFormData] = useState<Partial<CarbonQuickCheckInput>>(INITIAL_FORM);
  const [resolvedLocation, setResolvedLocation] = useState<ResolvedLocation | null>(null);
  const [resolvedClimate, setResolvedClimate]   = useState<KoppenClimateResult | null>(null);
  const [resolvedGrid, setResolvedGrid]         = useState<GridEmissionResult | null>(null);
  const [result, setResult]     = useState<CalculationResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [calcError, setCalcError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [shareMessage, setShareMessage] = useState('');

  const toggleSection = (key: AccordionKey) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const updateForm = useCallback((updates: Partial<CarbonQuickCheckInput>) => {
    setFormData(prev => {
      const next = { ...prev, ...updates };
      if (updates.programAreas)          next.programAreas          = { ...(prev.programAreas ?? {}),          ...updates.programAreas }          as CarbonQuickCheckInput['programAreas'];
      if (updates.residentialSplit)      next.residentialSplit      = { ...(prev.residentialSplit ?? {}),      ...updates.residentialSplit }      as CarbonQuickCheckInput['residentialSplit'];
      if (updates.mobilityQuestionnaire) next.mobilityQuestionnaire = { ...(prev.mobilityQuestionnaire ?? {}), ...updates.mobilityQuestionnaire } as CarbonQuickCheckInput['mobilityQuestionnaire'];
      return next;
    });
  }, []);

  const handleLocationResolved = useCallback((data: { location: ResolvedLocation; climate: KoppenClimateResult; grid: GridEmissionResult }) => {
    setResolvedLocation(data.location);
    setResolvedClimate(data.climate);
    setResolvedGrid(data.grid);
    setFormErrors(prev => { const n = { ...prev }; delete n.locationInput; return n; });
  }, []);

  const handleRunQuickCheck = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!resolvedLocation) errors.locationInput = 'Please resolve a project location first.';
    if (!formData.totalPopulation  || formData.totalPopulation  <= 0) errors.totalPopulation  = 'Required';
    if (!formData.totalBuiltAreaM2 || formData.totalBuiltAreaM2 <= 0) errors.totalBuiltAreaM2 = 'Required';
    if (!formData.siteAreaValue    || formData.siteAreaValue    <= 0) errors.siteAreaValue    = 'Required';
    if (!formData.geographicContext) errors.geographicContext = 'Required';
    if (!formData.projectType)       errors.projectType       = 'Required';

    const mq = formData.mobilityQuestionnaire;
    if (!mq || mq.parkingProvisionScore == null || mq.transitAccessScore == null || mq.mobilityCultureScore == null || mq.catchmentTypeScore == null || mq.expectedArrivalModeScore == null) {
      errors.mobilityQuestionnaire = 'Answer all 5 mobility questions.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (errors.locationInput || errors.totalPopulation || errors.totalBuiltAreaM2 || errors.siteAreaValue || errors.geographicContext || errors.projectType) {
        setOpenSections(prev => new Set([...prev, 'project']));
      }
      if (errors.mobilityQuestionnaire) setOpenSections(prev => new Set([...prev, 'mobility']));
      return;
    }

    setFormErrors({});
    setCalcError('');
    setLoading(true);
    try {
      const calcResult = runCalculations(formData as CarbonQuickCheckInput, resolvedLocation!, resolvedClimate!, resolvedGrid!);
      setResult(calcResult);
    } catch (err) {
      setCalcError(err instanceof Error ? err.message : 'Calculation failed. Check your inputs.');
    } finally {
      setLoading(false);
    }
  }, [formData, resolvedLocation, resolvedClimate, resolvedGrid]);

  const handleReset = useCallback(() => {
    setFormData(INITIAL_FORM);
    setResolvedLocation(null); setResolvedClimate(null); setResolvedGrid(null);
    setResult(null); setFormErrors({}); setCalcError('');
    setOpenSections(new Set(['project']));
  }, []);

  const handleShare = useCallback(() => {
    try { navigator.clipboard.writeText(window.location.href); setShareMessage('Link copied!'); }
    catch { setShareMessage('Share coming soon'); }
    setTimeout(() => setShareMessage(''), 2500);
  }, []);

  // Accordion completeness
  const projectComplete  = !!(resolvedLocation && formData.totalPopulation && formData.totalBuiltAreaM2 && formData.siteAreaValue && formData.geographicContext && formData.projectType);
  const buildingComplete = Object.values(formData.programAreas ?? {}).some(v => v > 0);
  const mobilityComplete = !!(formData.mobilityQuestionnaire?.parkingProvisionScore != null && formData.mobilityQuestionnaire?.transitAccessScore != null && formData.mobilityQuestionnaire?.mobilityCultureScore != null && formData.mobilityQuestionnaire?.catchmentTypeScore != null && formData.mobilityQuestionnaire?.expectedArrivalModeScore != null);
  const gridComplete     = !!resolvedGrid;

  const completeMap: Record<AccordionKey, boolean> = { project: projectComplete, building: buildingComplete, mobility: mobilityComplete, grid: gridComplete };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <SidebarNav activeTab={activeNavTab} onTabChange={setActiveNavTab} />

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', overflow: 'hidden' }}>
        <OverviewHeader onShare={handleShare} onReset={handleReset} shareMessage={shareMessage} />

        {/* Body: scrollable 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, padding: '16px 28px 0', overflow: 'auto' }}>
          {/* ── Left: Accordion input panels ───────────────────────────── */}
          <div style={{ paddingBottom: 24 }}>
            {PANELS.map(({ key: pKey, ...panel }) => (
              <AccordionSection
                key={pKey}
                {...panel}
                expanded={openSections.has(pKey)}
                onToggle={() => toggleSection(pKey)}
                complete={completeMap[pKey]}
              >
                {pKey === 'project'  && <ProjectDetailsPanel  data={formData} onChange={updateForm} errors={formErrors} onLocationResolved={handleLocationResolved} />}
                {pKey === 'building' && <BuildingProgramPanel  data={formData} onChange={updateForm} errors={formErrors} />}
                {pKey === 'mobility' && <MobilityContextPanel  data={formData} onChange={updateForm} errors={formErrors} />}
                {pKey === 'grid'     && <GridEnergyPanel       resolvedGrid={resolvedGrid} resolvedClimate={resolvedClimate} />}
              </AccordionSection>
            ))}

            {/* Run button */}
            <div style={{ marginTop: 4 }}>
              {Object.keys(formErrors).length > 0 && (
                <p style={{ fontSize: 11, color: '#dc2626', textAlign: 'center', marginBottom: 8 }}>Please fix the highlighted fields above.</p>
              )}
              <button
                type="button"
                onClick={handleRunQuickCheck}
                disabled={loading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', borderRadius: 8, background: loading ? '#8aab8a' : '#5a7a5a', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 0.5, border: 'none', cursor: loading ? 'default' : 'pointer', transition: 'background .15s', fontFamily: 'inherit' }}
              >
                {loading && (
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                )}
                {loading ? 'Calculating…' : 'Run Quick Check'}
              </button>
            </div>
          </div>

          {/* ── Right: Results ──────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
            {/* Hero */}
            <HeroCard result={result} location={resolvedLocation} projectName={formData.projectName} />

            {result ? (
              <>
                {/* Metric grid: breakdown donut + 3 category cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
                  <BreakdownCard result={result} />
                  <MetricCard sector="buildings" result={result} />
                  <MetricCard sector="mobility"  result={result} />
                  <MetricCard sector="infra"     result={result} />
                </div>

                {/* Bottom grid: chart tabs + signals */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 12, marginTop: 12 }}>
                  <ChartArea result={result} />
                  <SignalsPanel result={result} />
                </div>

                {/* Assumption strip */}
                <AssumptionStrip result={result} />
              </>
            ) : (
              <EmptyState loading={loading} error={calcError} />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        select { -webkit-appearance: none; appearance: none; }
      `}</style>
    </div>
  );
}
