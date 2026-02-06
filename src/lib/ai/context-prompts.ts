export const CONTEXT_PROMPTS: Record<string, string> = {
  general: "",

  excel: `

CONTEXT: Galen is currently working on an Excel-related task.
Focus your responses on Excel formulas, VBA macros, data manipulation,
pivot tables, Power Query, data validation, and conditional formatting.
When Claude Code can help automate an Excel task (e.g., generating CSVs,
parsing data, building reports), show how. Provide formulas with clear
explanations of each function used.`,

  salesforce: `

CONTEXT: Galen is currently working in Salesforce.
Focus on Salesforce administration, SOQL queries, report building,
dashboard creation, workflow rules, Process Builder, Flow, validation rules,
user management, permission sets, data import/export, and Apex basics.
When Claude Code can help with Salesforce tasks (e.g., data migration scripts,
bulk operations, API integrations), show how.`,

  fishbowl: `

CONTEXT: Galen is working with Fishbowl inventory management software.
Focus on inventory management, warehouse operations, part tracking,
bill of materials, purchase orders, sales orders, work orders,
manufacturing, shipping, receiving, and Fishbowl's integration capabilities
with QuickBooks, Salesforce, and other systems. Help with best practices
for inventory control and warehouse efficiency.`,

  documents: `

CONTEXT: Galen needs help with document generation or management.
Focus on creating templates, standard operating procedures (SOPs),
technical documentation, user guides, policy documents, and reports.
Show how Claude Code can help generate, transform, or automate
document creation. Consider Word document formatting, mail merge,
and PDF generation when relevant.`,

  pm: `

CONTEXT: Galen is working on project management tasks.
Focus on project planning, task breakdown and estimation, timeline creation,
stakeholder communication, risk management, status reporting, resource
allocation, and change management for IT projects. Relate advice to
IT department contexts like system migrations, software rollouts,
infrastructure upgrades, and process improvements. Suggest templates
and frameworks he can use immediately.`,
};
