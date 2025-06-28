
class NoiseGateProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    
    this.threshold = options.parameterData.threshold || -40;
    this.ratio = options.parameterData.ratio || 10;
    this.attack = options.parameterData.attack || 0.01;
    this.release = options.parameterData.release || 0.1;
    
    this.envelope = 0;
    this.sampleRate = sampleRate;
    this.attackCoeff = Math.exp(-1 / (this.attack * this.sampleRate));
    this.releaseCoeff = Math.exp(-1 / (this.release * this.sampleRate));
  }
  
  static get parameterDescriptors() {
    return [
      {
        name: 'threshold',
        defaultValue: -40,
        minValue: -80,
        maxValue: 0
      },
      {
        name: 'ratio',
        defaultValue: 10,
        minValue: 1,
        maxValue: 20
      }
    ];
  }
  
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    if (input.length === 0) return true;
    
    const inputChannel = input[0];
    const outputChannel = output[0];
    const threshold = parameters.threshold[0];
    
    for (let i = 0; i < inputChannel.length; i++) {
      const inputSample = inputChannel[i];
      const inputLevel = Math.abs(inputSample);
      
      // Convert to dB
      const inputDb = inputLevel > 0 ? 20 * Math.log10(inputLevel) : -Infinity;
      
      // Update envelope
      const targetEnvelope = inputDb > threshold ? 1 : 0;
      if (targetEnvelope > this.envelope) {
        this.envelope += (targetEnvelope - this.envelope) * (1 - this.attackCoeff);
      } else {
        this.envelope += (targetEnvelope - this.envelope) * (1 - this.releaseCoeff);
      }
      
      // Apply gate
      outputChannel[i] = inputSample * this.envelope;
    }
    
    return true;
  }
}

registerProcessor('noise-gate-processor', NoiseGateProcessor);
