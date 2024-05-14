#!/bin/bash
# load .env defines in root of repo
export DASHBOARD_LOCAL_REGISTRY_URI=boptest-dashboard-server_test
export DOCKER_HUB_WEB_REGISTRY_URI=boptest-dashboard-server

boptest-dashboard-server_tes

if [[ "${GITHUB_REF}" == "refs/heads/develop" ]]; then
    export VERSION_TAG="develop"
    echo "The docker tag is set to: ${VERSION_TAG}"
elif [[ "${GITHUB_REF}" =~ ^refs/tags/v[0-9].* ]]; then
    export VERSION_TAG="${GITHUB_REF/refs\/tags\//}"
    echo "The docker tag is set to: ${VERSION_TAG}"
elif [[ "${GITHUB_REF}" == "refs/heads/master" ]]; then
    export VERSION_TAG="latest"
    echo "The docker tag is set to: ${VERSION_TAG}"
fi

 if [[ "${VERSION_TAG}" == "develop" ]] || [[ "${VERSION_TAG}" =~ ^v[0-9].* ]] || [[ "${VERSION_TAG}" == "master" ]] ; then

    docker image ls
    docker tag ${DASHBOARD_LOCAL_REGISTRY_URI}:latest ${DOCKER_HUB_WEB_REGISTRY_URI}:${VERSION_TAG}; (( exit_status = exit_status || $? ))

    echo "pushing ${DOCKER_HUB_WEB_REGISTRY_URI}:${VERSION_TAG}"
    docker push ${DOCKER_HUB_WEB_REGISTRY_URI}:${VERSION_TAG}; (( exit_status = exit_status || $? ))
fi

exit $exit_status

