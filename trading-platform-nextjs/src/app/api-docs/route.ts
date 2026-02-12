import { NextRequest, NextResponse } from 'next/server';
import { swaggerSpec } from '@/lib/swagger';

/**
 * GET /api-docs
 * 
 * Serves Swagger/OpenAPI documentation UI
 * Interactive API documentation where you can:
 * - View all endpoints with descriptions
 * - See request/response schemas
 * - Test endpoints directly from the browser
 * - View authentication requirements
 * 
 * Access at: http://localhost:3000/api-docs
 */

export async function GET(request: NextRequest) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>ProTrader API Documentation</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.css">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html {
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
          }
          body {
            background-color: #09090b;
            color: #e2e8f0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .topbar {
            background-color: #09090b;
            border-bottom: 1px solid #27272a;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            position: sticky;
            top: 0;
            z-index: 100;
          }
          .topbar-logo {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            flex-shrink: 0;
          }
          .topbar-title {
            font-size: 16px;
            font-weight: 600;
            color: #f1f5f9;
          }
          .topbar-subtitle {
            font-size: 11px;
            color: #94a3b8;
          }
          .swagger-ui {
            background-color: #09090b !important;
          }
          .swagger-ui .topbar {
            display: none !important;
          }
          .swagger-ui .model-box {
            background-color: #18181b !important;
            border: 1px solid #27272a !important;
          }
          .swagger-ui .btn {
            background-color: #2563eb !important;
            border-color: #2563eb !important;
            color: white !important;
          }
          .swagger-ui .btn:hover {
            background-color: #1d4ed8 !important;
          }
          .swagger-ui input,
          .swagger-ui textarea,
          .swagger-ui select {
            background-color: #18181b !important;
            border: 1px solid #27272a !important;
            color: #e2e8f0 !important;
          }
          .swagger-ui input::placeholder,
          .swagger-ui textarea::placeholder {
            color: #64748b !important;
          }
          .swagger-ui .parameter__name,
          .swagger-ui .parameter__type,
          .swagger-ui .property__name {
            color: #e2e8f0 !important;
          }
          .swagger-ui .opblock {
            background-color: #18181b !important;
            border: 1px solid #27272a !important;
            margin: 0 0 12px 0 !important;
            border-radius: 6px !important;
          }
          .swagger-ui .opblock.opblock-get {
            border-left: 4px solid #3b82f6 !important;
          }
          .swagger-ui .opblock.opblock-post {
            border-left: 4px solid #10b981 !important;
          }
          .swagger-ui .opblock.opblock-put {
            border-left: 4px solid #f59e0b !important;
          }
          .swagger-ui .opblock.opblock-delete {
            border-left: 4px solid #ef4444 !important;
          }
          .swagger-ui .scheme-container {
            background-color: transparent !important;
            border: none !important;
          }
          .swagger-ui .info {
            margin: 32px 0 !important;
          }
          .swagger-ui .info .title {
            color: #f1f5f9 !important;
          }
          .swagger-ui .info .description {
            color: #cbd5e1 !important;
          }
          .swagger-ui table {
            background-color: #18181b !important;
          }
          .swagger-ui table thead tr {
            background-color: #27272a !important;
          }
          .swagger-ui table thead tr th {
            color: #e2e8f0 !important;
            border-color: #27272a !important;
          }
          .swagger-ui table tbody tr {
            border-color: #27272a !important;
          }
          .swagger-ui table tbody tr td {
            color: #cbd5e1 !important;
            border-color: #27272a !important;
          }
          .swagger-ui .response-col_status {
            color: #e2e8f0 !important;
          }
          .swagger-ui .response-col_description {
            color: #cbd5e1 !important;
          }
        </style>
      </head>
      <body>
        <div class="topbar">
          <div class="topbar-logo">T</div>
          <div>
            <div class="topbar-title">ProTrader API</div>
            <div class="topbar-subtitle">Real-time Risk Analytics • Production Ready</div>
          </div>
        </div>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-standalone-preset.js"></script>
        <script>
          SwaggerUIBundle({
            spec: ${JSON.stringify(swaggerSpec)},
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            layout: "BaseLayout"
          })
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
