if (!customElements.get('count-up')) {
    class CountUp extends HTMLElement {

        constructor() {
            super();
            this.settings = {
                min: 0,
                max: 100,
                step: 1,
                speed: 1,
                infinite: true
            }
        }

        connectedCallback() {
             this.init();
        }

        init() {
            if (this.classList.contains("count-up-init")) return;
            var self = this,
                data  = this.datasetToObject(this.dataset);
                Object.assign(this.settings, data);
            this.classList.add('count-up-init');
            if ("IntersectionObserver" in window) {
                let counterObserver = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            self.renderCounter();
                            self.classList.add('inView');
                            if(!data.infinite) counterObserver.unobserve(entry.target);
                        }else{
                            self.classList.remove('inView');
                        }
                    });
                });
                counterObserver.observe(self);                                  
            } else {
                self.renderCounter();
            }
        }

        datasetToObject(dataset) {
            return JSON.parse(JSON.stringify(dataset), (key, value) => {
                if (value === "null") return null;
                if (value === "true") return true;
                if (value === "false") return false;
                if (!isNaN(value)) return Number(value);
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return value;
                }
            });
        }

        renderCounter(counter){
            var self = this,
                min = this.settings.min,
                max = this.settings.max,
                step = this.settings.step,
                speed = this.settings.speed,
                counter = counter || min,
                element = this.querySelector('.counter');
            counter = counter + step;
            if (counter <= max) {
                element.innerHTML = counter.toString();
                setTimeout(function(){
                    self.renderCounter(counter);
                }, speed)    
            }else{
                element.innerHTML = max.toString();
            } 
        }

    }

    customElements.define("count-up", CountUp);
}