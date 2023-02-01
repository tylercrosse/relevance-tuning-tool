# Relevance Tuning Tool

![Screenshot of the top portion of the tool](/public/overview-top.png?raw=true)
![Screenshot of the bottom portion of the tool](/public/overview-bottom.png?raw=true)

## Background

This is a tool to compare two different Elasticsearch or OpenSearch queries against each other to evaluate the relevance of the results returned. This project is inspired by the [search comparison tool plugin](https://opensearch.org/docs/2.4/search-plugins/search-relevance/index/), that was recently [released to OpenSearch in 2.4.0](https://opensearch.org/blog/opensearch-2-4-is-available-today/). Here's a [link to the repo](https://github.com/opensearch-project/dashboards-search-relevance) for that tool, which uses the [osd-manaco package](https://github.com/opensearch-project/OpenSearch-Dashboards/tree/main/packages/osd-monaco) from the main [OpenSearch-Dashboards repo](https://github.com/opensearch-project/OpenSearch-Dashboards).

The OpenSearch cluster I have access to is still running OpenSearch v1.3 and I wanted to play around with the relevance of the search results in a few indexes I work on. I thought this would be a fun project to spin up. I wanted to help improve the relevance of our search results after recently reading [Relevant Search](https://www.manning.com/books/relevant-search) by Doug Turnbull and John Berryman, as well as [AI-Powered Search](https://www.manning.com/books/ai-powered-search) by Tray Grainger, Doug Turnbull, and Max Irwin.

## Architecture

Front end
- Create React App
- Ace Editor
- React Table

Back end (proxy server)
- Flask
- AWS SDK
## Getting Started

### Auth
**This project currently assumes you have an **ES or **OpenSearch** instance running** on AWS.** I'd like to support more auth in the future. It uses [requests-aws4auth](https://pypi.org/project/requests-aws4auth/) to read your `aws_access_key_id` and `aws_secret_access_key` from your default profile in your `~/.aws/credentials` file.

### Dependencies
1. Install the node modules

`npm install`

2. Install the python3 dependencies

`cd api && pip install -r requirements.txt`

### Start the front end and API

`npm run start` kicks off the front end and should automatically open your default browser at http://localhost:3000
`python api/api.py` will start the API. You will need to run this in a new tab.

