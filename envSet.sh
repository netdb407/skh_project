#!/bin/bash

en=$(grep -w $1 /etc/profile | tr -d ' ' )
len=$(expr length "$en")
if [ $len -eq 0 ]
then
  echo $1
  echo "export $1=$2" >> /etc/profile
  echo "export PATH=$PATH:$2/bin" >> /etc/profile
  source /etc/profile
fi

