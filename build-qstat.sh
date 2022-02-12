#!/bin/bash

git clone https://github.com/Unity-Technologies/qstat qstat-repo
cd qstat-repo  && \
make all -f Makefile.noauto && \
mv ./qstat ../qstat && \
cd .. && \
rm -fR qstat-repo