const logger = require('../utils/logger');

class RoundRobinLoadBalancer {
  constructor(services = []) {
    this.services = services;
    this.currentIndex = 0;
  }

  addService(service) {
    if (!this.services.includes(service)) {
      this.services.push(service);
      logger.info(`Service added to load balancer: ${service}`);
    }
  }

  removeService(service) {
    const index = this.services.indexOf(service);
    if (index > -1) {
      this.services.splice(index, 1);
      logger.info(`Service removed from load balancer: ${service}`);

      if (this.currentIndex >= this.services.length && this.services.length > 0) {
        this.currentIndex = 0;
      }
    }
  }

  getNextService() {
    if (this.services.length === 0) {
      throw new Error('No services available');
    }

    const service = this.services[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.services.length;

    logger.debug(`Selected service: ${service}`);
    return service;
  }

  getServiceHealth() {
    return this.services.map((service, index) => ({
      service,
      index,
      isCurrent: index === this.currentIndex,
    }));
  }

  updateServices(newServices) {
    this.services = newServices;
    this.currentIndex = 0;
    logger.info(`Load balancer services updated: ${newServices.join(', ')}`);
  }

  reset() {
    this.currentIndex = 0;
  }
}

// Weighted Round Robin Load Balancer
class WeightedRoundRobinLoadBalancer {
  constructor(services = []) {
    this.services = services.map((service) => ({
      url: typeof service === 'string' ? service : service.url,
      weight: typeof service === 'string' ? 1 : service.weight || 1,
      currentWeight: 0,
    }));
    this.totalWeight = this.services.reduce((sum, s) => sum + s.weight, 0);
  }

  getNextService() {
    if (this.services.length === 0) {
      throw new Error('No services available');
    }

    // Increment current weight for each service
    this.services.forEach((service) => {
      service.currentWeight += service.weight;
    });

    // Find service with max current weight
    const selected = this.services.reduce((max, current) =>
      current.currentWeight > max.currentWeight ? current : max
    );

    // Decrease current weight
    selected.currentWeight -= this.totalWeight;

    logger.debug(`Selected weighted service: ${selected.url} (weight: ${selected.weight})`);
    return selected.url;
  }

  updateServices(newServices) {
    this.services = newServices.map((service) => ({
      url: typeof service === 'string' ? service : service.url,
      weight: typeof service === 'string' ? 1 : service.weight || 1,
      currentWeight: 0,
    }));
    this.totalWeight = this.services.reduce((sum, s) => sum + s.weight, 0);
    logger.info('Weighted load balancer services updated');
  }
}

module.exports = {
  RoundRobinLoadBalancer,
  WeightedRoundRobinLoadBalancer,
};
