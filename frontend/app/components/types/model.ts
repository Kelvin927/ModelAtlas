export interface Reference {
  title?: string;
  url?: string;
  type?: string;
  note?: string;
}

export interface Comparison {
  with?: string;
  differences?: string[];
}

export interface Hyperparameter {
  name: string;
  type?: string;
  default?: any;
  range?: string;
  tips?: string;
}

export interface UsageExample {
  title?: string;
  dataset?: string;
  steps?: string[];
  expected_output?: string;
}

export interface Model {
  id: string;
  name: string;
  category?: string;
  tags?: string[];
  level?: string;
  summary?: string;
  app_scenarios?: string[];
  math?: {
    core_formula?: string;
    derivation?: string[];
    assumptions?: string[];
    constraints?: string[];
    variants?: string[];
  };
  hyperparameters?: Hyperparameter[];
  data_requirements?: {
    input?: string;
    scale_sensitivity?: string;
    missing_values?: string;
  };
  code?: {
    python_sklearn?: string;
    python_statsmodels?: string;
    python_pytorch?: string;
  };
  usage?: {
    workflow?: string[];
    examples?: UsageExample[];
  };
  evaluation?: {
    metrics?: string[];
    validation?: string;
    baselines?: string[];
  };
  strengths?: string[];
  weaknesses?: string[];
  pitfalls?: string[];
  comparisons?: Comparison[];
  visualizations?: string[];
  references?: Reference[];
  related?: string[];
  last_updated?: string;
}
