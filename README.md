<div align="center">
  <img src="public/logo-full.svg" alt="Rowfill Logo" width="200">
  <p>Open-source agentic tables platform for deep research and document analysis</p>
</div>

## 👋 Welcome to Rowfill

Rowfill is an open-source platform that transforms how you work with data through agentic tables. It combines powerful document extraction, deep research capabilities, and intelligent data processing to help you uncover insights from any data source.

## ✨ Features

### 🤖 Agentic Tables
- **AI-Powered Analysis**: Tables that understand context and can reason about your data
- **Autonomous Research**: Automatically extract, analyze, and synthesize information from multiple sources
- **Dynamic Insights**: Real-time data enrichment and intelligent suggestions as you work

### 📚 Deep Research & Extraction
- **Multi-Source Processing**: Extract data from documents, PDFs, images, web content, and databases
- **Semantic Understanding**: Advanced AI models that comprehend document context and relationships
- **Structured Output**: Automatically organize extracted information into meaningful table structures
- **Cross-Reference Analysis**: Connect and verify information across multiple sources

### 🔄 Data Processing
- **Intelligent Schema Detection**: Automatically adapt to and understand different data structures
- **Custom Workflows**: Create sophisticated data processing pipelines with AI assistance
- **Version Control**: Track changes and maintain data lineage
- **Export & Integration**: Seamlessly export to various formats and integrate with your tools

### 🔒 Privacy & Security
- **Local LLM Support**: Run with Local LLMs like Llama and Mistral, or use OpenAI vision models
- **Data Sovereignty**: Keep sensitive data within your infrastructure
- **Open Source**: AGPLv3 licensed for transparency and customization

## 🚀 Getting Started

1. Clone the repository
2. Run the docker compose file
3. Configure environment variables (see mockenv file)
4. Start exploring your data with agentic tables!

## 📚 Documentation

Visit our [documentation](https://docs.rowfill.com) for:
- Comprehensive guides and tutorials
- API reference
- Advanced features documentation
- Integration examples
- Best practices for data analysis

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the AGPLV3 License - see the [LICENSE](LICENSE) file for details.

## 💬 Community & Support

Join our growing community:
- [Discord Community](https://discord.gg/y65HPrCe)
- [GitHub Issues](https://github.com/harishdeivanayagam/rowfill/issues)
- [Email Support](mailto:hello@rowfill.com)

## 🖥 Cloud Version

Try Rowfill Cloud (Alpha) at [Rowfill Cloud](https://cloud.rowfill.com)

For early access, [contact us](mailto:support@rowfill.com)

---
**Note**: This project is under active development. While core features are stable, we're continuously adding new capabilities and improvements.

---
<div align="center">
  <p>Built with ❤️ for business folks</p>
</div>

## Webhook concurrency test

Payment providers can deliver webhook events late, twice, or out of order. `npm run test:race` runs the webhook's database writes in every possible order on a real Postgres with [VibeRaven](https://viberaven.dev) (`npx -y viberaven race`) and fails if any order breaks the rule in `race/webhook.race.json`. It also runs in `npm test`. Add a rule there when you add a webhook handler.
