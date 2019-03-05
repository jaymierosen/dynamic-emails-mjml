const fs = require("fs");
const path = require("path");
const mjml2html = require("mjml");
const mjmlUtils = require("mjml-utils");
const express = require("express");

// Get the file paths for the MJML template and
// the compiled HTML template
const mjmlTemplatePath = path.join(__dirname, "./example.mjml");
const htmlTemplatePath = path.join(__dirname, "./example.html");

// Read the contents of the MJML template into a string
const mjmlTemplateContent = fs.readFileSync(mjmlTemplatePath, "utf8");

// Compile the MJML template into static HTML immediately
fs.writeFileSync(htmlTemplatePath, mjml2html(mjmlTemplateContent).html);

// Create a basic Express server
const app = express();
const port = 8000;

// Handle a GET request at the root of the server URL
app.get("/", async (req, res) => {
  // Render your variables into the pre-compiled HTML template
  const emailHtml = await mjmlUtils.inject(htmlTemplatePath, {
    // Not the safest thing to do, since the query param could
    // contain malicious input, but it serves as an example
    // for using dynamic data
    firstName: req.query.firstName || "Jaymie",
    lastName: req.query.lastName || "Rosen"
  });

  // Send rendered email template as JSON
  // res.json({ emailHtml });

  // Send rendered email template as HTML
  res.send(emailHtml);
});

app.listen(port);
