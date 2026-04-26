'use client';

import { useState, useCallback } from 'react';
import type { CarbonQuickCheckInput, CalculationResult } from '@/types/carbon';
import type { ResolvedLocation } from '@/types/location';
import type { KoppenClimateResult } from '@/types/climate';
import type { GridEmissionResult } from '@/types/grid';
import { DEFAULT_INFRA_ALLOWANCE_PERCENT } from '@/data/infrastructureAssumptions';
import { runCalculations } from '@/lib/calculations';
import {
  validateProjectDetails,
  validateBuildingProgram,
  validateMobilityQuestionnaire,
} from '@/lib/validation';
import ProgressSteps from '@/components/ProgressSteps';
import ProjectDetailsStep from '@/components/ProjectDetailsStep';
import BuildingProgramStep from '@/components/BuildingProgramStep';
import MobilityQuestionnaireStep from '@/components/MobilityQuestionnaireStep';
import LoadingCalculation from '@/components/LoadingCalculation';
import ResultsView from '@/components/ResultsView';

type Step = 'projectDetails' | 'buildingProgram' | 'mobilityQuestionnaire' | 'loading' | 'results';

const WIZARD_STEPS = ['Project Details', 'Building Program', 'Mobility Context'];

const INITIAL_FORM: Partial<CarbonQuickCheckInput> = {
  projectName: '',
  locationInput: '',
  totalPopulation: undefined as unknown as number,
  totalBuiltAreaM2: undefined as unknown as number,
  siteAreaValue: undefined as unknown as number,
  siteAreaUnit: 'hectares',
  geographicContext: undefined,
  projectType: undefined,
  programAreas: {
    residential: 0,
    office: 0,
    retail: 0,
    hospitality: 0,
    educational: 0,
    healthcare: 0,
    industrial: 0,
    institutional: 0,
  },
  residentialSplit: {
    singleFamilyPercent: 30,
    multifamilyPercent: 70,
  },
  mobilityQuestionnaire: {
    parkingProvisionScore: null as unknown as 0,
    transitAccessScore: null as unknown as 0,
    mobilityCultureScore: null as unknown as 0,
    catchmentTypeScore: null as unknown as 0,
    expectedArrivalModeScore: null as unknown as 0,
  },
  infrastructureAllowancePercent: DEFAULT_INFRA_ALLOWANCE_PERCENT,
};

const STEP_INDEX: Record<string, number> = {
  projectDetails: 0,
  buildingProgram: 1,
  mobilityQuestionnaire: 2,
};

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<Step>('projectDetails');
  const [formData, setFormData] = useState<Partial<CarbonQuickCheckInput>>(INITIAL_FORM);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resolved external data — set when LocationInput resolves
  const [resolvedLocation, setResolvedLocation] = useState<ResolvedLocation | null>(null);
  const [resolvedClimate, setResolvedClimate] = useState<KoppenClimateResult | null>(null);
  const [resolvedGrid, setResolvedGrid] = useState<GridEmissionResult | null>(null);

  const updateForm = useCallback((updates: Partial<CarbonQuickCheckInput>) => {
    setFormData(prev => {
      const next = { ...prev, ...updates };
      if (updates.programAreas) {
        next.programAreas = { ...(prev.programAreas ?? {}), ...updates.programAreas } as CarbonQuickCheckInput['programAreas'];
      }
      if (updates.residentialSplit) {
        next.residentialSplit = { ...(prev.residentialSplit ?? {}), ...updates.residentialSplit } as CarbonQuickCheckInput['residentialSplit'];
      }
      if (updates.mobilityQuestionnaire) {
        next.mobilityQuestionnaire = { ...(prev.mobilityQuestionnaire ?? {}), ...updates.mobilityQuestionnaire } as CarbonQuickCheckInput['mobilityQuestionnaire'];
      }
      return next;
    });
    if (Object.keys(updates).length > 0) {
      setErrors(prev => {
        const next = { ...prev };
        Object.keys(updates).forEach(k => delete next[k]);
        return next;
      });
    }
  }, []);

  function handleLocationResolved(data: {
    location: ResolvedLocation;
    climate: KoppenClimateResult;
    grid: GridEmissionResult;
  }) {
    setResolvedLocation(data.location);
    setResolvedClimate(data.climate);
    setResolvedGrid(data.grid);
    setErrors(prev => {
      const next = { ...prev };
      delete next.locationInput;
      return next;
    });
  }

  function handleNext() {
    if (currentStep === 'projectDetails') {
      const validation = validateProjectDetails(formData, resolvedLocation);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }
      setErrors({});
      setCurrentStep('buildingProgram');
    } else if (currentStep === 'buildingProgram') {
      const validation = validateBuildingProgram(formData);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }
      setErrors({});
      setCurrentStep('mobilityQuestionnaire');
    } else if (currentStep === 'mobilityQuestionnaire') {
      const validation = validateMobilityQuestionnaire(formData.mobilityQuestionnaire);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }
      setErrors({});
      // All resolved data must be available — guarded by validateProjectDetails
      const calcResult = runCalculations(
        formData as CarbonQuickCheckInput,
        resolvedLocation!,
        resolvedClimate!,
        resolvedGrid!,
      );
      setResult(calcResult);
      setCurrentStep('loading');
    }
  }

  function handleBack() {
    if (currentStep === 'buildingProgram') setCurrentStep('projectDetails');
    else if (currentStep === 'mobilityQuestionnaire') setCurrentStep('buildingProgram');
  }

  function handleLoadingComplete() {
    setCurrentStep('results');
  }

  function handleReset() {
    setFormData(INITIAL_FORM);
    setResult(null);
    setErrors({});
    setResolvedLocation(null);
    setResolvedClimate(null);
    setResolvedGrid(null);
    setCurrentStep('projectDetails');
  }

  function handleEditInputs() {
    setCurrentStep('projectDetails');
  }

  const isWizardStep = currentStep !== 'loading' && currentStep !== 'results';
  const stepIndex = STEP_INDEX[currentStep] ?? 0;

  return (
    <div className="flex-1 flex flex-col">
      {currentStep === 'projectDetails' && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Carbon Quick Check</h1>
            <p className="text-base text-gray-600 mb-1">
              Early-stage operational carbon estimates for master planning.
            </p>
            <p className="text-sm text-gray-400 max-w-2xl">
              Estimate building, mobility, and shared infrastructure emissions using simple project inputs
              and transparent planning assumptions.
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        {isWizardStep && (
          <ProgressSteps currentStep={stepIndex} steps={WIZARD_STEPS} />
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {currentStep === 'projectDetails' && (
            <>
              <h2 className="text-base font-semibold text-gray-800 mb-5">Step 1: Project Details</h2>
              <ProjectDetailsStep
                data={formData}
                onChange={updateForm}
                errors={errors}
                onLocationResolved={handleLocationResolved}
              />
            </>
          )}

          {currentStep === 'buildingProgram' && (
            <>
              <h2 className="text-base font-semibold text-gray-800 mb-1">Step 2: Building Program</h2>
              <p className="text-sm text-gray-500 mb-5">
                How is the total built area of {(formData.totalBuiltAreaM2 ?? 0).toLocaleString()} m² distributed by program?
              </p>
              <BuildingProgramStep
                data={formData}
                onChange={updateForm}
                errors={errors}
              />
            </>
          )}

          {currentStep === 'mobilityQuestionnaire' && (
            <>
              <h2 className="text-base font-semibold text-gray-800 mb-1">Step 3: Mobility Context</h2>
              <p className="text-sm text-gray-500 mb-5">
                Answer 5 questions to assign a mobility profile to the project.
              </p>
              <MobilityQuestionnaireStep
                data={formData}
                onChange={updateForm}
                errors={errors}
              />
            </>
          )}

          {currentStep === 'loading' && (
            <LoadingCalculation onComplete={handleLoadingComplete} />
          )}

          {currentStep === 'results' && result && (
            <ResultsView
              result={result}
              onReset={handleReset}
              onEditInputs={handleEditInputs}
            />
          )}
        </div>

        {isWizardStep && (
          <div className="flex items-center justify-between pb-4">
            <div>
              {currentStep !== 'projectDetails' && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
            >
              {currentStep === 'mobilityQuestionnaire' ? (
                <>Run Carbon Quick Check</>
              ) : (
                <>
                  Continue
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
