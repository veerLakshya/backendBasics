const app = require("express")();
const jobs = {};

app.post("/submit", (req, res) => {
  const jobId = Date.now();
  jobs[jobId] = 0;
  updateJobProgress(jobId, 0);
  res.end(`Job submitted with ID: ${jobId}`);
});

app.get("/checkstatus/:jobId", (req, res) => {
  const jobId = req.params.jobId;
  if (!jobs[jobId]) {
    return res.status(404).end("Job not found");
  } else {
    res.end("\n\nJobStatus: " + jobs[jobId] + "%\n\n");
  }
});

app.listen(8001, () => {
  console.log("Server is listening on port 8001");
});

function updateJobProgress(jobId, progress) {
  jobs[jobId] = progress;
  console.log(`updated ${jobId} to ${progress}%`);
  if (progress == 100) return;
  this.setTimeout(() => updateJobProgress(jobId, progress + 10), 3000);
}
