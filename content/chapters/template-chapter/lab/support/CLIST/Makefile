
#/******************************************/
#/*                                        */
#/*        Alexander Agdgomlishvili        */
#/*                                        */
#/*         cdevelopment@mail.com          */
#/*                                        */
#/******************************************/

# BSD 2-Clause License
#
# Copyright (c) 2020, Alexander Agdgomlishvili
# cdevelopment@mail.com
#
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# 1. Redistributions of source code must retain the above copyright notice, this
#    list of conditions and the following disclaimer.
#
# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

# Github link: https://github.com/AlexanderAgd/CLIST

src = clist.c test.c test_parallel.c

headers = clist.h

libObjects = clist.o

objects = $(libObjects) test.o
objects_parallel = $(libObjects) test_parallel.o

CC = gcc -g -W -O2 $(Cflags)

LIB = libclist.a

TARGET = test
TARGET_PARALLEL = test_parallel

libraries = -lpthread

all :  LIBRARY $(TARGET) $(TARGET_PARALLEL)

clean :
	rm -rvf *.o *.log *.txt $(LIB) $(TARGET) $(TARGET_PARALLEL)

%.o : %.c
	$(CC) -c -o $@ $<

LIBRARY : $(libObjects)
	ar rcs $(LIB) $(libObjects) 

$(TARGET) : $(objects)
	$(CC) $(Cflags) $^ -o $@ $(Lflags) $(libraries)

$(TARGET_PARALLEL) : $(objects_parallel)
	$(CC) $(Cflags) $^ -o $@ $(Lflags) $(libraries)
		
STRIP : 
	strip -s $(TARGET)

ECHO_STRING :
	@echo "\n\n-------------------------------------------------------------\n\n"
