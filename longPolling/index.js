const app = require("express")();
const jobs = {};

app.post("/submit", (req, res) => {
  const jobId = Date.now().toString();
  jobs[jobId] = 0;
  updateJobStatus(jobId, 0);
  res.end("\n\n" + jobId + "\n\n");
});

app.get("/checkstatus/:id", async (req, res) => {
  const jobId = req.params.id;
  console.log(`Checking job ${jobId}, current progress: ${jobs[jobId]}`);

  // Check if job exists
  if (jobs[jobId] === undefined) {
    return res.status(404).end("\n\nJob not found\n\n");
  }

  //long polling, don't respond until done
  while ((await checkJobComplete(jobId)) == false);
  res.end("\n\nJobStatus: Complete " + jobs[jobId] + "%\n\n");
});

app.listen(8001, () => console.log("listening on 8001"));

async function checkJobComplete(jobId) {
  return new Promise((resolve, reject) => {
    if (jobs[jobId] < 100) setTimeout(() => resolve(false), 1000);
    else resolve(true);
  });
}

function updateJobStatus(jobId, progress) {
  jobs[jobId] = progress;
  console.log(`updated ${jobId} to ${progress}`);
  if (progress == 100) return;
  setTimeout(() => updateJobStatus(jobId, progress + 10), 10000);
}
