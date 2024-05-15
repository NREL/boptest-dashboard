#!/bin/bash
# load .env defines in root of repo
export DASHBOARD_SERVER_LOCAL_REGISTRY_URI=boptest-dashboard_server-k8s
export DASHBOARD_SERVER_DOCKER_HUB_REGISTRY_URI=nrel/boptest-dashboard-server

export DASHBOARD_CLIENT_LOCAL_REGISTRY_URI=boptest-dashboard_client-k8s
export DASHBOARD_CLIENT_DOCKER_HUB_REGISTRY_URI=nrel/boptest-dashboard-client


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
    docker tag ${DASHBOARD_SERVER_LOCAL_REGISTRY_URI}:latest ${DASHBOARD_SERVER_DOCKER_HUB_REGISTRY_URI}:${VERSION_TAG}; (( exit_status = exit_status || $? ))
    docker tag ${DASHBOARD_CLIENT_LOCAL_REGISTRY_URI}:latest ${DASHBOARD_CLIENT_DOCKER_HUB_REGISTRY_URI}:${VERSION_TAG}; (( exit_status = exit_status || $? ))

    echo "pushing ${DASHBOARD_SERVER_DOCKER_HUB_REGISTRY_URI}:${VERSION_TAG}"
    echo "pushing ${DASHBOARD_CLIENT_DOCKER_HUB_REGISTRY_URI}:${VERSION_TAG}"
   
    docker push ${DASHBOARD_SERVER_DOCKER_HUB_REGISTRY_URI}:${VERSION_TAG}; (( exit_status = exit_status || $? ))
    docker push ${DASHBOARD_CLIENT_DOCKER_HUB_REGISTRY_URI}:${VERSION_TAG}; (( exit_status = exit_status || $? ))
fi

exit $exit_status

