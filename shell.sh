brew update
az login
az account set --subscription cff83f95-63c7-44d3-80f8-26251ff8f8ec
az functionapp keys set -g Warehouse -n functionInventory --key-type functionKeys --key-name customerLogin
