## Install helmfile tool

Install `helmfile` by using this [link](https://github.com/helmfile/helmfile?tab=readme-ov-file#installation)

## Use the desired values file
Rename the desired values file you want to `values.yaml`

## Required configuration changes
1. Replace your kubernetes context on the `helmfile.yaml`
1. Replace your `lognegar-api-key: <YOUR_API_KEY>` on the `values.yaml`

## Helmfile commands
1. `helmfile diff`
2. `helmfile apply -i`
