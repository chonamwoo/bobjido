const mongoose = require('mongoose');

const algorithmPerformanceSchema = new mongoose.Schema({
  algorithmId: {
    type: String,
    required: true,
    unique: true
  },
  algorithmType: {
    type: String,
    enum: [
      'collaborative_filtering',
      'content_based',
      'hybrid',
      'matrix_factorization',
      'deep_learning',
      'popularity',
      'trending',
      'location_based',
      'time_based',
      'social',
      'similar_users',
      'taste_matching'
    ],
    required: true
  },
  version: {
    type: String,
    required: true
  },
  
  // 성능 메트릭
  metrics: {
    // 정확도 메트릭
    accuracy: {
      mae: { type: Number, default: 0 },      // Mean Absolute Error
      rmse: { type: Number, default: 0 },     // Root Mean Square Error
      precision: { type: Number, default: 0 }, // Precision@K
      recall: { type: Number, default: 0 },    // Recall@K
      f1Score: { type: Number, default: 0 },   // F1 Score
      auc: { type: Number, default: 0 }        // Area Under Curve
    },
    
    // 사용자 참여 메트릭
    engagement: {
      ctr: { type: Number, default: 0 },           // Click-Through Rate
      cvr: { type: Number, default: 0 },           // Conversion Rate
      avgSessionDuration: { type: Number, default: 0 },
      bounceRate: { type: Number, default: 0 },
      returnRate: { type: Number, default: 0 }
    },
    
    // 다양성 메트릭
    diversity: {
      catalogCoverage: { type: Number, default: 0 },  // 추천된 아이템의 다양성
      novelty: { type: Number, default: 0 },          // 새로운 아이템 추천 비율
      serendipity: { type: Number, default: 0 },      // 예상치 못한 좋은 추천
      intraListDiversity: { type: Number, default: 0 } // 추천 리스트 내 다양성
    },
    
    // 비즈니스 메트릭
    business: {
      revenue: { type: Number, default: 0 },
      userSatisfaction: { type: Number, default: 0 },
      userRetention: { type: Number, default: 0 },
      viralCoefficient: { type: Number, default: 0 }
    },
    
    // 시스템 메트릭
    system: {
      latency: { type: Number, default: 0 },         // 평균 응답 시간 (ms)
      throughput: { type: Number, default: 0 },      // 초당 처리량
      errorRate: { type: Number, default: 0 },       // 에러율
      cacheHitRate: { type: Number, default: 0 }     // 캐시 적중률
    }
  },
  
  // A/B 테스트 결과
  abTests: [{
    testId: String,
    startDate: Date,
    endDate: Date,
    variant: String,
    sampleSize: Number,
    controlGroup: {
      size: Number,
      metrics: {
        ctr: Number,
        cvr: Number,
        satisfaction: Number
      }
    },
    testGroup: {
      size: Number,
      metrics: {
        ctr: Number,
        cvr: Number,
        satisfaction: Number
      }
    },
    statisticalSignificance: Number,
    winner: String,
    decision: String
  }],
  
  // 시간대별 성능
  temporalPerformance: {
    hourly: [{
      hour: { type: Number, min: 0, max: 23 },
      ctr: Number,
      cvr: Number,
      volume: Number
    }],
    daily: [{
      dayOfWeek: { type: Number, min: 0, max: 6 },
      ctr: Number,
      cvr: Number,
      volume: Number
    }],
    monthly: [{
      month: { type: Number, min: 1, max: 12 },
      ctr: Number,
      cvr: Number,
      volume: Number
    }]
  },
  
  // 세그먼트별 성능
  segmentPerformance: [{
    segmentType: String,  // 'age', 'location', 'tasteProfile', etc.
    segmentValue: String,
    sampleSize: Number,
    metrics: {
      ctr: Number,
      cvr: Number,
      satisfaction: Number,
      retention: Number
    }
  }],
  
  // 파라미터 튜닝 기록
  parameterTuning: [{
    timestamp: Date,
    parameters: Map,
    performance: {
      before: Number,
      after: Number,
      improvement: Number
    },
    adopted: Boolean
  }],
  
  // 모델 학습 기록
  trainingHistory: [{
    trainedAt: Date,
    datasetSize: Number,
    features: [String],
    hyperparameters: Map,
    trainingMetrics: {
      loss: Number,
      accuracy: Number,
      validationLoss: Number,
      validationAccuracy: Number
    },
    trainingDuration: Number, // 초
    modelSize: Number // MB
  }],
  
  // 예측 분포
  predictionDistribution: {
    histogram: [{
      bucket: String,
      count: Number,
      percentage: Number
    }],
    mean: Number,
    median: Number,
    std: Number,
    skewness: Number,
    kurtosis: Number
  },
  
  // 피드백 분석
  feedbackAnalysis: {
    positive: {
      count: Number,
      keywords: [{
        word: String,
        frequency: Number
      }],
      averageRating: Number
    },
    negative: {
      count: Number,
      keywords: [{
        word: String,
        frequency: Number
      }],
      averageRating: Number
    },
    suggestions: [{
      text: String,
      frequency: Number,
      implemented: Boolean
    }]
  },
  
  // 실시간 모니터링
  monitoring: {
    isActive: { type: Boolean, default: true },
    lastHealthCheck: Date,
    anomalies: [{
      detectedAt: Date,
      type: String,
      severity: String,
      description: String,
      resolved: Boolean,
      resolvedAt: Date
    }],
    alerts: [{
      timestamp: Date,
      level: String,
      message: String,
      acknowledged: Boolean
    }]
  },
  
  // 비교 분석
  comparison: {
    baseline: {
      algorithmId: String,
      improvement: Number,
      significantBetter: [String],
      significantWorse: [String]
    },
    competitors: [{
      algorithmId: String,
      winRate: Number,
      metrics: {
        ctr: Number,
        cvr: Number,
        diversity: Number
      }
    }]
  }
}, {
  timestamps: true
});

// 인덱스
algorithmPerformanceSchema.index({ algorithmId: 1 }, { unique: true });
algorithmPerformanceSchema.index({ algorithmType: 1 });
algorithmPerformanceSchema.index({ 'metrics.accuracy.f1Score': -1 });
algorithmPerformanceSchema.index({ 'metrics.engagement.ctr': -1 });
algorithmPerformanceSchema.index({ createdAt: -1 });

// 메트릭 업데이트
algorithmPerformanceSchema.methods.updateMetrics = async function(newMetrics) {
  const alpha = 0.1; // Exponential moving average factor
  
  // 정확도 메트릭 업데이트
  if (newMetrics.accuracy) {
    for (const [key, value] of Object.entries(newMetrics.accuracy)) {
      if (this.metrics.accuracy[key] !== undefined) {
        this.metrics.accuracy[key] = this.metrics.accuracy[key] * (1 - alpha) + value * alpha;
      }
    }
  }
  
  // 참여 메트릭 업데이트
  if (newMetrics.engagement) {
    for (const [key, value] of Object.entries(newMetrics.engagement)) {
      if (this.metrics.engagement[key] !== undefined) {
        this.metrics.engagement[key] = this.metrics.engagement[key] * (1 - alpha) + value * alpha;
      }
    }
  }
  
  return this.save();
};

// 성능 점수 계산
algorithmPerformanceSchema.methods.calculatePerformanceScore = function() {
  const weights = {
    accuracy: 0.3,
    engagement: 0.4,
    diversity: 0.2,
    system: 0.1
  };
  
  let score = 0;
  
  // 정확도 점수
  const accuracyScore = (
    this.metrics.accuracy.precision * 0.3 +
    this.metrics.accuracy.recall * 0.3 +
    this.metrics.accuracy.f1Score * 0.4
  );
  score += accuracyScore * weights.accuracy;
  
  // 참여 점수
  const engagementScore = (
    this.metrics.engagement.ctr * 0.4 +
    this.metrics.engagement.cvr * 0.4 +
    (1 - this.metrics.engagement.bounceRate) * 0.2
  );
  score += engagementScore * weights.engagement;
  
  // 다양성 점수
  const diversityScore = (
    this.metrics.diversity.catalogCoverage * 0.3 +
    this.metrics.diversity.novelty * 0.3 +
    this.metrics.diversity.serendipity * 0.2 +
    this.metrics.diversity.intraListDiversity * 0.2
  );
  score += diversityScore * weights.diversity;
  
  // 시스템 점수
  const systemScore = (
    (1 - Math.min(this.metrics.system.latency / 1000, 1)) * 0.4 + // 1초 이내 응답
    this.metrics.system.cacheHitRate * 0.3 +
    (1 - this.metrics.system.errorRate) * 0.3
  );
  score += systemScore * weights.system;
  
  return Math.min(100, Math.max(0, score * 100));
};

// 이상 탐지
algorithmPerformanceSchema.methods.detectAnomalies = function() {
  const anomalies = [];
  
  // CTR 이상
  if (this.metrics.engagement.ctr < 0.01) {
    anomalies.push({
      detectedAt: new Date(),
      type: 'low_ctr',
      severity: 'high',
      description: 'CTR is below 1%',
      resolved: false
    });
  }
  
  // 에러율 이상
  if (this.metrics.system.errorRate > 0.05) {
    anomalies.push({
      detectedAt: new Date(),
      type: 'high_error_rate',
      severity: 'critical',
      description: 'Error rate exceeds 5%',
      resolved: false
    });
  }
  
  // 레이턴시 이상
  if (this.metrics.system.latency > 500) {
    anomalies.push({
      detectedAt: new Date(),
      type: 'high_latency',
      severity: 'medium',
      description: 'Average latency exceeds 500ms',
      resolved: false
    });
  }
  
  // 다양성 이상
  if (this.metrics.diversity.catalogCoverage < 0.1) {
    anomalies.push({
      detectedAt: new Date(),
      type: 'low_diversity',
      severity: 'low',
      description: 'Catalog coverage is below 10%',
      resolved: false
    });
  }
  
  if (anomalies.length > 0) {
    this.monitoring.anomalies.push(...anomalies);
    this.monitoring.lastHealthCheck = new Date();
  }
  
  return anomalies;
};

// A/B 테스트 결과 분석
algorithmPerformanceSchema.methods.analyzeABTest = function(testId) {
  const test = this.abTests.find(t => t.testId === testId);
  
  if (!test) {
    return null;
  }
  
  // 통계적 유의성 계산 (간단한 Z-test)
  const p1 = test.controlGroup.metrics.cvr;
  const p2 = test.testGroup.metrics.cvr;
  const n1 = test.controlGroup.size;
  const n2 = test.testGroup.size;
  
  const p = (p1 * n1 + p2 * n2) / (n1 + n2);
  const se = Math.sqrt(p * (1 - p) * (1/n1 + 1/n2));
  const z = (p2 - p1) / se;
  
  // 95% 신뢰구간
  const significance = 2 * (1 - this.normalCDF(Math.abs(z)));
  
  test.statisticalSignificance = significance;
  test.winner = significance < 0.05 ? (p2 > p1 ? 'test' : 'control') : 'none';
  
  return {
    winner: test.winner,
    improvement: ((p2 - p1) / p1) * 100,
    significance: significance,
    confident: significance < 0.05
  };
};

// 정규분포 CDF (간단한 근사)
algorithmPerformanceSchema.methods.normalCDF = function(x) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  
  const t = 1 / (1 + p * x);
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t3 * t;
  const t5 = t4 * t;
  
  const y = t * Math.exp(-x * x + a1 * t + a2 * t2 + a3 * t3 + a4 * t4 + a5 * t5);
  
  return 0.5 * (1 + sign * (1 - y));
};

// 최적 알고리즘 선택
algorithmPerformanceSchema.statics.selectBestAlgorithm = async function(context) {
  const algorithms = await this.find({ 'monitoring.isActive': true });
  
  let bestAlgorithm = null;
  let bestScore = 0;
  
  for (const algo of algorithms) {
    let score = algo.calculatePerformanceScore();
    
    // 컨텍스트별 가중치 조정
    if (context) {
      if (context.needDiversity && algo.metrics.diversity.catalogCoverage > 0.3) {
        score *= 1.2;
      }
      if (context.needSpeed && algo.metrics.system.latency < 100) {
        score *= 1.1;
      }
      if (context.userSegment) {
        const segment = algo.segmentPerformance.find(s => 
          s.segmentType === context.userSegment.type && 
          s.segmentValue === context.userSegment.value
        );
        if (segment && segment.metrics.satisfaction > 0.8) {
          score *= 1.15;
        }
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestAlgorithm = algo;
    }
  }
  
  return bestAlgorithm;
};

const AlgorithmPerformance = mongoose.model('AlgorithmPerformance', algorithmPerformanceSchema);

module.exports = AlgorithmPerformance;