(function(mg, $, undefined) {
/*----------------------------------------------
	Global Variables
----------------------------------------------*/
	// Private
	var self = $(document.currentScript).data(),
		fps = 10,
		fps_avg = [],
		jobs = {};
	
	// Public
	mg.debug = {
		general: true,
		jobs: true
	};
	mg.ready = false;
	
/*----------------------------------------------
	Private Functions
----------------------------------------------*/
	function thread(last) {
		// Set now time
		var now = mg.now();
		var after = 0;
		var runtime = 0;
		
		// Update FPS
		updateFPS(now - last);
		
		// Loop through jobs
		$.each(jobs, function(k, v) {
			// See if it's time to run the job
			if(now - v.last >= v.when) {
				if(mg.debug.jobs && v.debug) { console.log('Running Job -> ' + k + ' (' + jobs[k].count + ')'); }

				// Set last run time to now
				jobs[k].last = now;
				
				// Run the job's function
				v.function();
				
				// Increase job run count
				jobs[k].count++;
				
			}
		});
		
		// Set after time
		after = mg.now();
		
		// Calculate runtime
		runtime = after - now;
		
		setTimeout(function() {
			thread(after);
		}, ((1000 - runtime) / fps));
	}
	
	function updateFPS(time) {
		time = 1000 / time;
		fps_avg.unshift(time);
		if(fps_avg.length > 10) { fps_avg.pop(); }
	}
	
	function getFPS() {
		var sum = 0;
		for(var i = 0; i < fps_avg.length; i++){
			sum += fps_avg[i];
		}
		var avg = Math.round((sum / fps_avg.length) * 100) / 100;
		if(!avg) { avg = fps; }
		return avg;
	}

/*----------------------------------------------
	Public Functions
----------------------------------------------*/
	mg.initialize = function() {
		if(mg.debug) { console.log('MG -> Initialization Started'); }

		mg.ready = true;
		
		if(mg.debug) { console.log('MG -> Initialization Completed'); }
		
		mg.jobs('test').add({
			function: function() {
				console.log(getFPS());
			},
			when: 1000
		});
		
		// Start thread
		thread();
	}
	
	// Job controller
	mg.jobs = function(job_name = false) {
		// Return job list if no job_name was provided
		if(!job_name) { return jobs; }
		
		// Return functions
		return {
			// Add job
			add: function(job_info) {
				// See if job exists already
				if(mg.jobs(job_name).exists()) { throw 'A job named "' + job_name + '" already exists.'; }
				
				// Check for missing parameters
				if(job_info.function === undefined) { throw 'Missing "function" parameter.'; }
				if(job_info.when === undefined) { throw 'Missing "when" parameter.'; }
				
				// Add job to job object
				jobs[job_name] = {
					function: job_info.function,
					when: job_info.when,
					last: (job_info.last !== undefined ? job_info.last : 0),
					debug: (job_info.debug !== undefined ? job_info.debug : true),
					count: 0
				};
				
				return true;
			},
			// Remove job
			remove: function() {
				// See if job exists
				if(mg.jobs(job_name).exists()) {
					// Delete the job
					delete(jobs[job_name]);
					return true;
				}
				
				return false;
			},
			// Restart job
			restart: function() {
				// See if job exists
				if(mg.jobs(job_name).exists()) {
					// Set last run time to 0
					jobs[job_name].last = 0;
				
					return true;
				}
				
				return false;
			},
			// Job info
			info: function() {
				// See if job exists
				if(mg.jobs(job_name).exists()) {
					return jobs[job_name];
				}
				
				return false;
			},
			// See if job exists
			exists: function() {
				return jobs[job_name] !== undefined;
			}
		}
	}
	
	// Now
	mg.now = function() {
		return Math.floor((new Date).getTime());
	}
	
} (window.mg = window.mg || {}, $));