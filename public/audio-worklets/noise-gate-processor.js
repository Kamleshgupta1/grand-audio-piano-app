/**
 * Noise Gate Audio Worklet Processor
 * Attenuates audio below a threshold to reduce background noise
 */

class NoiseGateProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{
      name: 'threshold',
      defaultValue: -40,
      minValue: -100,
      maxValue: 0
    }];
  }

  constructor() {
    super();
    this.envelope = 0;
    this.attackTime = 0.001; // 1ms
    this.releaseTime = 0.1; // 100ms
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    if (!input || !input[0]) {
      return true;
    }

    const threshold = parameters.threshold[0];
    const thresholdLinear = Math.pow(10, threshold / 20);

    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      for (let i = 0; i < inputChannel.length; i++) {
        const inputSample = inputChannel[i];
        const inputLevel = Math.abs(inputSample);

        // Envelope follower
        if (inputLevel > this.envelope) {
          this.envelope += (inputLevel - this.envelope) * this.attackTime;
        } else {
          this.envelope += (inputLevel - this.envelope) * this.releaseTime;
        }

        // Apply gate
        let gain;
        if (this.envelope > thresholdLinear) {
          gain = 1.0;
        } else {
          // Smooth transition to avoid clicks
          gain = this.envelope / thresholdLinear;
        }

        outputChannel[i] = inputSample * gain;
      }
    }

    return true;
  }
}

registerProcessor('noise-gate-processor', NoiseGateProcessor);
