# Compute

The main criterion we use to rank CPUs is their _computation power_, i.e. their ability to crunch numbers and do math.
Numerous benchmarks exist out there and they are publicly displayed on websites such as [CPUBenchmark](https://www.cpubenchmark.net/).

This benchmark measures the performance of the computer's CPU in a variety of scenarios:
- its ability to perform integer operations
- its speed in floating point arithmetic
- data encryption and compression
- sorting algorithms and others

You can take a look at what exactly is measured using [this link](https://www.cpubenchmark.net/cpu.php?cpu=AMD+Ryzen+Threadripper+PRO+5995WX).
It displays the scores obrtained by a high-end CPU.
Apart from the tests above, other benchmarks can also focus on other performance metrics such as branch prediction or prefetching.

Other approaches are less artificial, measuring performance on real-world applications such as compile times and performance in the lastest (and most resource-demandign) video games.
The latter metric revolves around how many average FPS (frames per second) a given CPU is able to crank out in a specific video game.
[This article](https://www.gamersnexus.net/guides/3577-cpu-test-methodology-unveil-for-2020-compile-gaming-more) goes into more detail regarding the methodology of running CPU benchmarks on real-world applications.

Most benchmarks, unfortunately, are not open source, especially the more popular ones, such as [Geekbench 5](https://browser.geekbench.com/processor-benchmarks).
Despite this shortcoming, benchmarks are widely used to compare the performance of various computer **hardware**, CPUs included.

## The Role of the Operating System

As you've seen so far, the CPU provides the "muscle" requried for fast computation. i.e. the highly optimised hardware and multiple ALUs, FPUs
and cores necessary to perform those computations.
However, it is the **operating system** that provides the "brains" for this computation.
Specifically, modern CPUs have the capacity to run multiple tasks in parallel.
But they do not provide a means to decide which task to run at each moment.
The OS comes as an _orchestrator_ to **schedule** the way these tasks (that we will later call threads) are allowed to run and use the CPU's resources.
This way OS tells the CPU what code to run on each CPU core so that it reaches a good balance between high throughput (running many instructions) and fair access to CPU cores.

It is cumbersome for a user-level application to interact directly with the CPU.
The developer would have to write hardware-specific code which is not scalable and is difficult to maintain.
In addition, doing so would leave it up to the developer to isolate their application from the others that are present on the system.
This leaves applications vulnerable to countless bugs and exploits.

To guard apps from these pitfalls, the OS comes and mediates interactions between regular programs and the CPU by providing a set of **abstractions**.
These abstractions offer a safe, uniform and also isolated way to leverage the CPU's resources, i.e. its cores.
There are 2 main abstractions: **processes** and **threads**.

![Interaction between applications, OS and CPU](./media/app-os-cpu-interaction.svg)

As we can see from the image above, an application can spawn one or more processes.
Each of these is handled and maintained by the OS.
Similarly, each process can spawn however many threads, which are also managed by the OS.
The OS decides when and on what CPU core to make each thread run.
This is in line with the general of interaction between an application and the hardware: it is always mediated by the OS.

## Processes

A process is simply a running program.
Let's take the `ls` command as a trivial example.
`ls` is a **program** on your system.
It has a binary file which you can find and inspect with the help of the `which` command:

```
student@os:~$ which ls
/usr/bin/ls

student@os:~$ file /usr/bin/ls
/usr/bin/ls: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=6e3da6f0bc36b6398b8651bbc2e08831a21a90da, for GNU/Linux 3.2.0, stripped
```

When you run it, the `ls` binary stored **on the disk** at `/usr/bin/ls` is read by another application called the **loader**.
The loader spawns a **process** by copying some of the contents `/usr/bin/ls` in memory (such as the `.text`, `.rodata` and `.data` sections).
Using `strace`, we can see the [`execve`](https://man7.org/linux/man-pages/man2/execve.2.html) system call:

```
student@os:~$ strace -s 100 ls -a  # -s 100 limits strings to 100 bytes instead of the default 32
execve("/usr/bin/ls", ["ls", "-a"], 0x7fffa7e0d008 /* 61 vars */) = 0
[...]
write(1, ".  ..  content\tCONTRIBUTING.md  COPYING.md  .git  .gitignore  README.md  REVIEWING.md\n", 86.  ..  content	CONTRIBUTING.md  COPYING.md  .git  .gitignore  README.md  REVIEWING.md
) = 86
close(1)                                = 0
close(2)                                = 0
exit_group(0)                           = ?
+++ exited with 0 +++
```
Look at its parameters:
- the path to the **program**: `/usr/bin/ls`
- the list of arguments: `"ls", "-a"`
- the enivronment variables: the rest of the syscall's arguments

`execve` invokes the loader to create the `ls` process.
All subsequent syscalls are performed by the newly spawned `ls` process.
We will get into more details regarding `execve` [towards the end of this lab](#TODO-section).

TODO - image: creation of a process - loader

## Sum of the Elements in an Array

Let's assume we only have one process on our system and that process knows how to add the numbers in an array.
It can use however many resources it wants since there is no other process to contest it.
It would probabily look like the code in `support/sum-array/d/sum_array_sequential.d`.
The program also measures the time spent computing the sum.
Let's compile and run it:

```
student@os:~/.../lab/support/sum-array/d$ ./sum_array_sequential
Array sum is: 49945994146
Time spent: 127 ms
```

You will most likely get a different sum (because the array is made up of random numbers) and a different time than the ones shown above.
This is perfectly fine.
Use these examples qualitatively, not quantitatively.

### Spreading the Work Among Other Processes

Due to how it's implemented so far, our program only uses one of our CPU's cores.
We never tell it to distribute its workload on other cores.
This is wasteful as the rest of our cores remain unused:

```
student@os:~$ lscpu | grep ^CPU\(s\):
CPU(s):                          8
```
We have 7 more cores waiting to add numbers in our array.

![What if we used 100% of the CPU?](./media/100-percent-cpu.jpeg)

What if we use 7 more processes between which we spread the task of adding the numbers in this array?
If we split the array into several equal parts and designate a separate process to calculate the sum of each part, we should get a speedup because now the work performed by each individual process is reduced.

Let's take it methodically.
Compile and run `sum_array_processes.d` using 1, 2, 4 and 8 processes respectively.
If your system only has 4 cores ([hyperthreading](https://www.intel.com/content/www/us/en/gaming/resources/hyper-threading.html) included), limit your runs to 4 processes.
Note the running times for each number of processes.
We expect the speedups compared to our reference run to be 1, 2, 4 and 8 respectively, right?

[Quiz](./quiz/processes-speedup.md)

You most likely did get some speedup, especially when using 8 processes.
Now we will try to improve this speedup by using **threads** instead.

Also notice that we're not using hundreds or thousands of processes.
Assuming our system has 8 cores, only 8 _threads_ (we'll see this later in the lab) can run at the same time.
In general, **the maximum number of threads that can run at the same time is equal to the number of cores**.
In our example, each process only has one thread: its main thread.
So by consequence and by forcing the terminology (because it's the main thread of these processes that is running, not the processes themselves), we can only run in parallel a number of processes equal to at most the number of cores.

#### Practice: Baby steps - Python

Run the code in `support/create-process/popen.py`.
It simply spawns a new process running the `ls` command using [`subprocess.Popen()`](https://docs.python.org/3/library/subprocess.html#subprocess.Popen).
Do not worry about the huge list of arguments that `Popen()` takes.
They are used for inter-process-communication.
You'll learn more about this in the [Application Interaction chapter](../../app-interact/).

Note that this usage of `Popen()` is not entirely correct.
You'll discover why in the next exercise, but for now focus on simply understanding how to use `Popen()` on its own.

Now change the command to anything you want.
Also give it some arguments.
From the outside, it's as if you were running these commands from the terminal.

#### Practice: High level - Python

Head over to `support/sleepy/sleepy_creator.py`.
Use `subprocess.Popen()` to spawn 10 `sleep 1000` processes.

1. Now use the same `pstree -pac` command and look for `sleepy_creator.py`.
It is a `python3` process, as this is the interpreter that runs the script, but we call it the `sleepy_creator.py` process for simplicity.
If you found it, you did something wrong.
It should be missing.
Now use `pstree -pac` and look for the `sleep` processes you have just created.

[Quiz](./quiz/parent-of-sleep-processes.md)

2. Change the code in `sleepy_creator.py` so that the `sleep 1000` processes are the children of `sleepy_creator.py`.
Kill the previously created `sleep` processes using `killall sleep`.
Verify that `sleepy_creator.py` remains the parent of the `sleep`s it creates using `pstree -pac`.

#### Practice: Lower level - C

Now let's see how to create a child process in C.
There are multiple ways of doing this.
For now, we'll start with a higher-level approach.

Go to `support/sleepy/sleepy_creator.c` and use [`system`](https://man7.org/linux/man-pages/man3/system.3.html) to create a `sleep 1000` process.

[Quiz](./quiz/create-sleepy-process-ending.md)

The `man` page also mentions that `system` calls `fork()` and `exec()` to run the command it's given.
If you want to find out more about them, head over to the [Arena and create your own mini-shell](#mini-shell).

#### Practice: Wait for Me!

Run the code in `support/wait-for-me/wait_for_me_processes.py`.
The parent process creates one child that writes and message to the given file.
Then the parent reads that message.
Simple enough, right?
But running the code raises a `FileNotFoundError`.
If you inspect the file you gave the script as an argument, it does contain a string.
What's going on?

[Quiz](./quiz/cause-of-file-not-found-error.md)

In order to solve race conditions, we need **synchronisation**.
This is a mechanism similar to a set of traffic lights in a crossroads.
Just like traffic lights allow some cars to pass only after others have already passed, synchronisation is a means for threads to communicate with each other and tell each other to access a resource or not.

The most basic form of synchronisation is **waiting**.
Concretely, if the parent process **waits** for the child to end, we are sure the file is created and its contents are written.
Use `join()` to make the parent wait for its child before reading the file.

#### Practice: `fork()`

Up to now we've been creating processes using various high-level APIs, such as `Popen()`, `Process()` and `system()`.
Yes, despite being a C function, as you've seen from its man page, `system()` itself calls 2 other functions: `fork()` to create a process and `execve()` to execute the given command.
As you already know from the [Software Stack](../../software-stack/) chapter, library functions may call one or more underlying system calls or other functions.
Now we will move one step lower on the call stack and call `fork()` ourselves.

`fork()` creates one child process that is _almost_ identical to its parent.
We say that `fork()` returns **twice**: once in the parent process and once more in the child process.
This means that after `fork()` returns, assuming no error has occurred, both the child and the parent resume execution from the same place: the instruction following the call to `fork()`.
What's different between the two processes is the value returned by `fork()`:
- **child process**: `fork()` returns 0
- **parent process**: `fork()` returns the PID of the child process (> 0)
- **on error**: `fork()` returns -1, only once, in the initial process

Therefore, the typical code for handling a `fork()` is available in `support/create-process/fork.c`.
Take a look at it and then run it.
Notice what each of the two processes prints:
- the PID of the child is also known by the parent
- the PPID of the child is the PID of the parent

Unlike `system()`, who also waits for its child, when using `fork()` we must do the waiting ourselves. 
In order to wait for a process to end, we use the [`waitpid()`](https://linux.die.net/man/2/waitpid) syscall.
It places the exit code of the child process in the `status` parameter.
This argument is actually a bitfield containing more information that merely the exit code.
To retrieve the exit code, we use the `WEXITSTATUS` macro.
Keep in mind that `WEXITSTATUS` only makes sens if `WIFEXITED` is true, i.e. if the child process finished on its own and wasn't killed by another one or by an illegal action (such as a seg fault or illegal instruction) for example.
Otherwise, `WEXITSTATUS` will return something meaningless.
You can view the rest of the information stored in the `status` bitfield [in the man page](https://linux.die.net/man/2/waitpid).

Now modify the example to do the following:

1. Change the return value of the child process so that the value displayed by the parent is changed.

2. Create a child process of the newly created child.
Use a similar logic and a similar set of prints to those in the support code.
Take a look at the printed PIDs.
Make sure the PPID of the "grandchild" is the PID of the child, whose PPID is, in turn, the PID of the parent.

**Moral of the story**: Usually the execution flow is `fork()`, followed by `wait()` (called by the parent) `exit()`, called by the child.
The order of last 2 steps may be swapped.

### Spreading the Work Among Other Threads

Compile the code in `support/sum-array/d/sum_array_threads.d` and run it using 1, 2, 4 and 8 threads as you did before.
Each thread runs the `calculateArrayPartSum` function and then finishes.
Running times should be _slightly_ smaller than the implementation using processes.
This slight time difference is caused by process creation actions, which are costlier than thread creation actions.
Because a process needs a separate virtual address space (VAS) and needs to duplicate some internal structures such as the file descriptor table and page table, it takes the operating system more time to create it than to create a thread.
On the other hand, threads belonging to the same process share the same VAS and, implicitly, the same OS-internal structures.
Therefore, they are more lightweight than processes.

#### Practice: Wait for Me Once More!

Go to `support/wait-for-me/wait_for_me_threads.d`.
Spawn a thread that executes the `negateArray()` function.
For now, do not wait for it to finish; simply start it.

Compile the code and run the resulting executable several times.
See that the negative numbers appear from different indices.
This is precisely the nondeterminism that we talked about [in the previous section](#practice-wait-for-me).

Now wait for that thread to finish and see that all the printed numbers are consistently negative.

As you can see, waiting is a very coarse form of synchronisation.
If we only use waiting, we can expect no speedup as a result of parallelism, because one thread must finish completely before another can continue.
We will discuss more fine-grained synchronisation mechanisms [later in this lab](#synchronisation).

Also, at this point, you might be wondering why this exercise is written in D, while [the same exercise, but with processes](#practice-wait-for-me) was written in Python.
There is a very good reason for this and has to do with how threads are synchronized by default in Python.
You can find out what this is about [in the Arena section](#the-gil), after you have completed the [Synchronisation section](#synchronisation).

### Threads vs Processes

So why use the implementation that spawns more processes if it's slower than the one using threads?

#### Safety

Compile and run the two programs in `support/sum-array-bugs/seg-fault/`, first with 2 processes and threads and then with 4.
They do the same thing as before: compute the sum the elements in an array, but with a twist: each of them contains a bug causing a seg fault.
Notice that `sum_array_threads` doesn't print anything with 4 threads, but merely a "Segmentation fault" message.
On the other hand, `sum_array_processes` prints a sum and a running time, albeit different from the sums we've seen so far.

The reason is that signals such as `SIGSEGV`, which is used when a segmentation fault happens affect the entire process that handles them.
Therefore, when we split our workload between several threads and one of them causes an error such as a seg fault, that error is going to terminate the entire process.
The same thing happens when we use processes instead of threads: one process causes an error, which gets it killed, but the other processes continue their work unhindered.
This is why we end up with a lower sum in the end: because one process died too early and didn't manage to write the partial sum it had computed to the `results` array.

#### Practice: Wait for It!

The process that spawns all the others and subsequently calls `waitpid` to wait for them to finish can also get their return codes.
Update the code in `support/sum-array-bugs/seg-fault/sum_array_processes.d` and modify the call to `waitpid` to obtain and investigate this return code.
Display an appropriate message if one of the child processes returns an error.

Remember to use the appropriate [macros](https://linux.die.net/man/2/waitpid) for handling the `status` variable that is modified by `waitpid`, as it is a bitfield.
When a process runs into a system error, it receives a signal.
A signal is a means to interrupt the normal execution of a program from the outside.
It is associated with a number.
Use `kill -l` to find the full list of signals. 

[Quiz](./quiz/seg-fault-exit-code.md)

So up to this point we've seen that one advantage of processes is that they offer better safety than threads.
Because they use separate virtual address spaces, sibling processes are better isolated than threads.
Thus, an application that uses processes can be more robust to errors than if it were using threads.

#### Memory Corruption

Because they share the same address space,  threads run the risk of corrupting each other's data.
Take a look at the code in `support/sum-array-bugs/memory-corruption/python/`.
The two programs only differ in how they spread their workload.
One uses threads while the other uses processes.

Run both programs with and without memory corruption.
Pass any value as a third argument to trigger the corruption.

```
student@os:~/.../sum-array-bugs/memory-corruption/python$ python3 memory_corruption_processes.py <number_of_processes>  # no memory corruption
[...]

student@os:~/.../sum-array-bugs/memory-corruption/python$ python3 memory_corruption_processes.py <number_of_processes> 1  # do memory corruption
[...]
```

The one using threads will most likely print a negative sum, while the other displays the correct sum.
This happens because all threads refer the same memory for the array `arr`.
What happens to the processes is a bit more complicated.

[Later in this lab](#copy-on-write) we will see that initially, the page tables of all processes point to the same physical frames or `arr`.
When the malicious process tries to corrupt this array by **writing data to it**, the OS duplicates the original frames of `arr` so that the malicious process writes the corrupted values to these new frames, while leaving the original ones untouched.
This mechanism is called **Copy-on-Write** and is an OS optimisation so that memory is shared between the parent and the child process, until one of them attempts to write to it.
At this point, this process receives its own separate copies of the previously shared frames.

Note that in order for the processes to share the `sums` dictionary, it is not created as a regular dictionary, but using the `Manager` module.
This module provides some special data structures that are allocated in **shared memory** so that all processes can access them.
You can learn more about shared memory and its various implementations [in the Arena section](#shared-memory).

## Usage of Processes and Threads in `apache2`

We'll take a look at how a real-world application - the `apache2` HTTP server - makes use of processes and threads.
Since the server must be able to handle multiple clients at the same time, it must therefore use some form of concurrency.
When a new client arrives, the server offloads the work of interacting with that client to another process or thread.

The choice of whether to use multiple processes or threads is not baked into the code.
Instead, `apache2` provides a couple of modules called MPMs (Multi-Processing Modules).
Each module implements a different concurrency model and the users can pick whatever module best fits their needs by editing the server configuration files.

The most common MPMs are
- `prefork`: there are multiple worker processes, each process is single-threaded and handles one client request at a time
- `worker`: there are multiple worker processes, each process is multi-threaded, and each thread handles one client request at a time
- `event`: same as `worker` but designed to better handle some particular use cases

In principle, `prefork` provides more stability and backwards compatibility, but it has a bigger overhead.
On the other hand, `worker` and `event` are more scalable, and thus able to handle more simultaneous connections, due to the usage of threads.
On modern systems `event` is almost always the default.

### `apache2` Live Action

Let's run an actual instance of `apache2` and see how everything works.
Go to `support/apache2` and run `make run`.
This will start a container with `apache2` running inside.

Check that the server runs as expected:

```
student@os:~$ curl localhost:8080
<html><body><h1>It works!</h1></body></html>
```

Now go inside the container and take a look at running processes:

```
student@os:~/.../lab/support/apache2$ docker exec -it apache2-test bash

root@56b9a761d598:/usr/local/apache2# ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 20:38 pts/0    00:00:00 httpd -DFOREGROUND
www-data       9       1  0 20:38 pts/0    00:00:00 httpd -DFOREGROUND
www-data      10       1  0 20:38 pts/0    00:00:00 httpd -DFOREGROUND
root          25       0  0 20:40 pts/1    00:00:00 bash
root          31      25  0 20:40 pts/1    00:00:00 ps -ef
```

We see 3 `httpd` processes.
The first one, running as root, is the main process, while the other 2 are the workers.

Let's confirm that we are using the `event` mpm:

```
root@56b9a761d598:/usr/local/apache2# grep mod_mpm conf/httpd.conf
LoadModule mpm_event_module modules/mod_mpm_event.so
#LoadModule mpm_prefork_module modules/mod_mpm_prefork.so
#LoadModule mpm_worker_module modules/mod_mpm_worker.so
```

The `event` mpm is enabled, so we expect each worker to be multi-threaded.
Let's check:

```
root@56b9a761d598:/usr/local/apache2# ps -efL
UID          PID    PPID     LWP  C NLWP STIME TTY          TIME CMD
root           1       0       1  0    1 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       8       1       8  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       8       1      11  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       8       1      12  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       8       1      16  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       8       1      17  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       8       1      18  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       8       1      19  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       9       1       9  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       9       1      14  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       9       1      15  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       9       1      20  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       9       1      21  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       9       1      22  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data       9       1      23  0    7 20:56 pts/0    00:00:00 httpd -DFOREGROUND
root          24       0      24  1    1 20:56 pts/1    00:00:00 bash
root          30      24      30  0    1 20:56 pts/1    00:00:00 ps -efL
```

Indeed, each worker has 7 threads.
In fact, the number of threads per worker is configurable, as well as the number of initial workers.

When a new connection is created, it will be handled by whatever thread is available from any worker.
If all the threads are busy, then the server will spawn more worker processes (and therefore more threads), as long as the total number of threads is below some threshold, which is also configurable.

Let's see this dynamic scaling in action.
We need to create a number of simultaneous connections that is larger than the current number of threads.
There is a simple script in `support/apache2/make_conn.py` to do this:

```
student@os:~/.../lab/support/apache2$ python3 make_conn.py localhost 8080
Press ENTER to exit
```

The script has created 100 connections and will keep them open until we press Enter.

Now, in another terminal, let's check the situation inside the container:

```
student@os:~/.../lab/support/apache2$ docker exec -it apache2-test bash

root@56b9a761d598:/usr/local/apache2# ps -efL
UID          PID    PPID     LWP  C NLWP STIME TTY          TIME CMD
root           1       0       1  0    1 20:56 pts/0    00:00:00 httpd -DFOREGROUND
www-data      40       1      40  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      40       1      45  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      40       1      46  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      40       1      51  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      40       1      52  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      40       1      53  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      40       1      54  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      55       1      55  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      55       1      58  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      55       1      60  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      55       1      62  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      55       1      63  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      55       1      65  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data      55       1      66  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
[...]
www-data     109       1     109  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data     109       1     115  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data     109       1     116  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data     109       1     121  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data     109       1     122  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data     109       1     123  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
www-data     109       1     124  0    7 21:07 pts/0    00:00:00 httpd -DFOREGROUND
root         146       0     146  0    1 21:10 pts/1    00:00:00 bash
root         152     146     152  0    1 21:10 pts/1    00:00:00 ps -efL
```

We see a much larger number of threads, as expected.

### Practice: Investigate `apache2` Using `strace`

Use `strace` to discover the server document root.
The document root is the path in the filesystem from where httpd serves all the files requested by the clients.

First you will have to stop the running container using `make stop`, then restart it with `make run-privileged`.

Then you will use `strace` inside the container to attach to the worker processes (use the `-p` option for this).
You will also have to use `-f` flag with `strace`, so that it will follow all the threads inside the processes.

After you have attached successfully to all worker processes, use the `curl` command to send a request, like the one in the beginning of this section.

Then check the `strace` output to see what files were opened by the server.

[Quiz](./quiz/apache2-strace.md)

### Conclusion

So far, you've probably seen that spawning a process can "use" a different program (hence the path in the args of `system` or `Popen`), but some languages such as Python allow you to spawn a process that executes a function from the same script.
A thread, however, can only start from a certain entry point **within the current address space**, as it is bound to the same process.
Concretely, a process is but a group of threads.
For this reason, when we talk about scheduling or synchronisation, we talk about threads.
A thread is, thus, an abstraction of a task running on a CPU core.
A process is a logical group of such tasks.

We can sum up what we've learned so far by saying that processes are better used for separate, independent work, such as the different connections handled by a server.
Conversely, threads are better suited for replicated work: when the same task has to be performed on multiple cores.
However, replicated work can also be suited for processes.
Distributed applications, however, leverage different processes as this allows them to run on multiple physical machines at once.
This is required by the very large workloads such applications are commonly required to process.

These rules are not set in stone, though.
Like we saw in the `apache2` example, the server uses multiple threads as well as multiple processes.
This provides a degree of stability - if one worker thread crashes, it will only crash the other threads belonging to the same process - while still taking advantage of the light resource usage inherent to threads.

This kind of trade-offs are a normal part in the development of real-world applications.

## Copy-on-Write

So far you know that the parent and child process have separate virtual address spaces.
But how are they created, namely how are they "separated"?
And what about the **physical address space**?
Of course we would like the stack of the parent, for example, to be physically distinct from that of the child so they can execute different functions and use different local variables.

But should **all** the PAS of the parent be distinct from that of the child?
What about some read-only memory sections, such as `.text` and `.rodata`?
And what about the heap, where the child _may_ use some data previously written by the parent and then override it with its own data.

The answer to all of these questions is a core mechanism of multi-process operating systems called **Copy-on-Write**.
It works according to one very simple principle:
> The VAS of the child process initially points to the same PAS as that of the parent.
> A (physical) frame is only duplicated by the child when it attempts to **write** data to it.

This ensures that read-only sections remain shared, while writable sections are shared as long as their contents remain unchanged.
When changes happen, the process making the change receives a unique frame as a modified copy of the original frame _on demand_.

In the image below we have the state of the child and parent processes right after `fork()` returns in both of them.
See how each has its own VAS, both of them being mapped to (mostly) the same PAS.


When one process writes data to a writeable page (in our case, the child writes to a heap page), the frame to which it corresponds is first duplicated.
Then the process' page table points the page to the newly copied frame, as you can see in the image below.


**Be careful!**
Do not confuse copy-on-write with demand paging.
Remember from the [Data chapter](../../data/) that demand paging means that when you allocate memory the OS allocates virtual memory that remains unmapped to physical memory until it's used.
On the other hand, copy-on-write posits that the virtual memory is already mapped to some frames.
These frames are only duplicated when one of the processes attempts to write data to them.

#### Practice

Now let's see the copy-on-write mechanism in practice.
Keep in mind that `fork()` is a function used to create a process.

Open two terminals (or better: use [`tmux`](https://github.com/tmux/tmux/wiki)).
In one of them compile and run the code in `support/fork-faults/fork_faults.c`.
After each time you press `Enter` in the first terminal window, run the following command in the second window:

```
student@os:~/.../lab/support/fork-faults$ ps -o min_flt,maj_flt $(pidof fork_faults)
```

It will show you the number of minor and major page faults performed by the `fork_faults` process and its child.

[Quiz 1](./quiz/parent-faults-before-fork.md)

Note that after `fork()`-ing, there is a second row in the output of `ps`.
That corresponds to the child process.
The first one still corresponds to the parent.

[Quiz 2](./quiz/child-faults-after-write.md)

Now it should be clear how demand paging differs from copy-on-write.
Shared memory is a similar concept.
It's a way of marking certain allocated pages so that copy-on-write is disabled.
As you may imagine, changes made by the parent to this memory are visible to the child and vice-versa.
You can learn more about it [its dedicated section in the Arena](#shared-memory).

## Synchronisation

So far we've used threads and processes without wondering how to "tell" them how to access shared data.
Moreover, in order to make threads wait for each other, we simply had the main thread wait for the others to finish all their work.
But what if we want one thread to wait until another one simply performs some specific action after which it resumes its execution?
For this, we need to use some more complex synchronisation mechanisms.

### Race Conditions

For example, what if one thread wants to increase a global variable while another one wants to decrease it?
Let's say the assembly code for increasing and decreasing the variable looks like the one in the snippet below.

```asm
increase:
    mov eax, [var]
    inc eax
    mov [var], eax

decrease:
    mov eax, [var]
    dec eax
    mov [var], eax
```

Imagine both threads executed `mov eax, [var]` at the same time.
Then each would independently increase its (**non-shared**) `eax` register.
In the end, the final value of `var` depends on which thread executes `mov [var], eax` _last_.
So it's kind of a reversed race.
The thread that runs the slowest "wins" this race and writes the final value of `var`.
But this is up to the scheduler and is non-deterministic.
Such undefined behaviours can cripple the execution of a program if `var` is some critical variable.

Let's see this bug in action.
Go to `support/race-condition/d/race_condition.d`, compile and run the code a few times.
It spawns to threads that do exactly what we've talked about so far: one thread increments `var` 10 million times, while the other decrements it 10 million times.

As you can see from running the program, the differences between subsequent runs can be substantial.
To fix this, we must ensure that **only one thread** can execute either `var++` or `var--` at any time.
We call these code sections **critical sections**.
A critical section is a piece of code that can only be executed by **one thread** at a time.
So we need some sort of _mutual exclusion mechanism_ so that when one thread runs the critical section, the other has to **wait** before entering it.
This mechanism is called a **mutex**, whose name comes from "mutual exclusion".

Go to `support/race-condition/d/race_condition_mutex.d` and notice the differences between this code and the buggy one.
We now use a `Mutex` variable which we `lock()` at the beginning of a critical section and we `unlock()` at the end.
Generally speaking `lock()`-ing a mutex makes a thread enter a critical section, while calling `unlock()` makes the thread leave said critical section.
Therefore, as we said previously, the critical sections in our code are `var--` and `var++`.
Run the code multiple times to convince yourself that in the end, the value of `var` will always be 0.

Mutexes contain an internal variable which can be either 1 (locked) or 0 (unlocked).
When a thread calls `lock()`, it attempts to set that variable to 1.
If it was 0, the thread sets it to 1 and proceeds to execute the critical section.
Otherwise, it **suspends its execution** and waits until that variable is set to 0 again.

When calling `unlock()`, the internal variable is set to 0 and all waiting threads are woken up to try to acquire the mutex again.
**Be careful:** It is generally considered unsafe and [in many cases undefined behaviour](https://pubs.opengroup.org/onlinepubs/9699919799/functions/pthread_mutex_lock.html) to call `unlock()` from a different thread than the one that acquired the lock.
So the general workflow should look something like this:

```
within a single thread:
    mutex.lock()
    // do atomic stuff
    mutex.unlock()
```

#### Synchronisation - Overhead

> There ain't no such thing as a free lunch

This saying is also true for multithreading.
Running threads in parallel is nice and efficient, but synchronisation always comes with a penalty: overhead.
Use the `time` command to record the running times of `race_condition` and `race_condition_mutex`.
Notice that those of `race_condition_mutex` are larger than those of `race_condition`.

The cause of this is that now when one thread is executing the critical section, the other has to wait and do nothing.
Waiting means changing its state from RUNNING to WAITING, which brings further overhead from the scheduler.
This latter overhead comes from the **context switch**s that is necessary for a thread to switch its state from RUNNING to WAITING and back.

#### Practice: Wrap the Whole `for` Statements in Critical Sections

Move the calls to `lock()` and `unlock()` outside the `for` statements so that the critical sections become the entire statement.
Measure the time spent now by the code and compare it with the times recorded when the critical sections were made up of only `var--` and `var++`.

[Quiz](./quiz/coarse-vs-granular-critical-section.md)

### Atomics

So now we know how to use mutexes.
And we know that mutexes work by using an internal variable that can be either 1 (locked) or 0 (unlocked).
But how does `lock()` actually set that variable to 1?
How does it avoid a race condition in case another thread also wants to set it to 1?

We need a guarantee that anyone "touching" that variable does so "within its own critical section".
But now we need a critical section to implement a critical section...
To solve this circular problem, we make use of a very common _Deus ex Machina_: **hardware support**.

Modern processors are capable of _atomically_ accessing data, either for reads or writes.
An atomic action is and indivisible sequence of operations that a thread runs without interference from others.
Concretely, before initiating an atomic transfer on one of its data buses, the CPU first makes sure all other transfers have ended, then **locks** the data bus by stalling all cores attempting to transfer data on it.
This way, one thread obtains **exclusive** access to the data bus while accessing data.
As a side note, the critical sections in `support/race-condition/race_condition_mutex.d` are also atomic once they are wrapped between calls to `lock()` and `unlock()`. 

As with every hardware feature, the x86 ISA exposes the `lock` instruction, which makes a given instruction run atomically.
You can play with it [in the Arena](#atomic-assembly).

Compilers provide support for such hardware-level atomic operations.
GCC exposes [builtins](https://gcc.gnu.org/onlinedocs/gcc/_005f_005fatomic-Builtins.html) such as `__atomic_load()`, `__atomic_store()`, `__atomic_compare_exchange()` and many others.
All of them rely on the mechanism described above.

In D, this functionality is implemented in the `core.atomic` module.
Go to `support/race-condition/d/race_condition_atomic.d` and complete the function `decrementVar()`.
Compile and run the code.
Now measure its running time against the mutex implementations.
It should be somewhere between `race_condition.d` and `race_condition_mutex.d`.

So using the hardware support is more efficient, but it can only be leveraged for simple, individual instructions, such as loads and stores.

### Semaphores

Up to know we've learned how to create critical sections that can be accessed by **only one thread** at a time.
These critical sections revolved around **data**.
Whenever we define a critical section, there is some specific data to which we cannot allow parallel access.
The reason why we can't allow it is, in general, data integrity, as we've seen in our examples in `support/race-condition/`

But what if threads need to count?
Counting is inherently thread-unsafe because it's a _read-modify-write_ operation.
We read the counter, increment (modify) it and then write it back.
Think about our example with [`apache2`](#usage-of-processes-and-threads-in-apache2)
Let's say a `worker` has created a _pool_ of 3 threads.
They are not doing any work initially;
they are in the WAITING state.
As clients initiate connections, these threads are picked up and are used to serve **at most 3** connections at a time.
But the number of connections may be arbitrarily large.
Therefore, we need a way to keep track of it.
When serving a client, a thread should decrement it to inform the others that a connection has been finished.
In short, we need a counter that the dispatcher increments and that worker threads decrement.

Such a counter could be implemented using a **semaphore**.
For simplicity's sake, you can view a semaphore as simply a mutex whose internal variable can take any value and acts like a counter.
When a thread attempts to `acquire()` a semaphore, it will wait if this counter is less than or equal to 0.
Otherwise, the thread **decrements** the internal counter and the function returns.
The opposite of `acquire()` is `release()`, which increases the internal counter by a given value (by default 1).

#### Practice: `apache2` Simulator - Semaphore

Go to `support/apache2-simulator/apache2_simulator_semaphore.py`.
In the `main()` function we create a semaphore which we increment (`release()`) upon every new message.
Each thread decrements (`acquire()`) this semaphore to signal that it wants to retrieve a message from the list.
The retrieval means modifying a data structure, which is a critical section, so we use a **separate** mutex for this.
Otherwise, multiple threads could acquire the semaphore at the same time and try to modify the list at the same time.
Not good.

Locking this mutex (which in Python is called `Lock`) is done with the following statement: `with msg_mutex:`
This is a syntactic equivalent to:

```Python
event.acquire()
messages.append(msg)
event.release()
```

[Quiz](./quiz/semaphore-equivalent.md)

Since the length of the `messages` list is simply `len(messages)`, it may seem a bit redundant to use a semaphore to store essentially the same value.
In the next section, we'll look at a more refined mechanism for our use case: _condition variables_.

### Conditions

Another way we can implement our `apache2` simulator is to use a condition variable.
This one is probably the most intuitive synchronisation primitive.
It's a means by which a thread can tell another one: "Hey, wake up, _this_ happened!".
So it's a way for threads to notify each other.
For this reason, the main methods associated with conditions are `notify()` and `wait()`.
As you might expect, they are complementary:

- `wait()` puts the thread in the WAITING state until it's woken up by another one
- `notify()` wakes up one or more `wait()`-ing threads.
If `notify()` is called before any thread has called `wait()`, the first thread that calls it will continue its execution unhindered.

#### Practice: `apache2` Simulator - Condition

But this is not all, unfortunately.
Look at the code in `support/apache2-simulator/apache2_simulator_condition.py`.
See the main thread call notify once it reads the message.
Notice that this call is within a `with event:` so it acquires some mutex / semaphore.

`acquire()` and `release()` are commonly associated with mutexes or semaphores.
What do they have to do with condition variables?

Well, a lock `Condition` variable also stores an inner lock (mutex).
It is this lock that we `acquire()` and `release()`.
In fact, the [documentation](https://docs.python.org/3/library/threading.html#condition-objects) states we should only call `Condition` methods with its inner lock taken.

Why is this necessary?
Take a look at the `worker()` function.
After `wait()`-ing (we'll explain the need for the loop in a bit), it extracts a message from the message queue.
This operation is **not** atomic, so it must be enclosed within a critical section.
Hence, the lock.

[Quiz](./quiz/notify-only-with-mutex.md)

So now we know we cannot only use a mutex.
The mutex is used to access and modify the `messages` list atomically.
Now you might be thinking that this code causes a deadlock:

```Python
with event:
    while len(messages) == 0:
        event.wait()
```

The thread gets the lock and then, if there are no messages, it switches its state to WAITING.
A classic deadlock, right?
No.
`wait()` also releases the inner lock of the `Condition` and being woken up reacquires it.
Neat!
And the `while` loop that checks if there are any new messages is necessary because `wait()` can return after an arbitrary long time.
Therefore, it's necessary to check for messages again when waking up.

So now we have both synchronisation **and** signalling.
This is what conditions are for, ultimately.

Now that you understand the concept of synchronisation, you should apply it in a broader context.
[In the Arena](#synchronisation---thread-safe-data-structure), you'll find an exercise asking you to make an existing arraylist implementation thread-safe.
Have fun!

## Thread-Local Storage (TLS)

First things first: what if we don't want data to be shared between threads?
Are we condemned to have to worry about race conditions?
Well, no.

To protect data from race conditions "by design", we can place in what's called **Thread-Local Storage (TLS)**.
As its name implies, this is a type of storage that is "owned" by individual threads, as opposed to being shared among all threads.
**Do not confuse it with copy-on-write**.
TLS pages are always duplicated when creating a new thread and their contents are re-initialised.

#### Practice: D - TLS by Default

Take a look again at `support/race-condition/d/race_condition.d`, specifically at how `var` is declared:

```d
__gshared int var;
```

Have you wondered what the `__gshared` keyword does?
Well, for memory safety reasons, in D, all variables are by default **not shared** between threads.
We need to specifically ask the language to let us share a variable between threads.
We can do this using either the `__gshared` or `shared` keywords.
You've seed `shared` in `support/race-condition/d/race_condition_atomic.d`.

The difference between them is that `shared` only allows programmers read-modify-write the variable atomically, as we do in `support/race-condition/d/race_condition_atomic.d`.
Modify the `incrementVar()` function and increment `var` like you would any variable: `var++`.
Try to compile the code.
It fails.
The compiler is smart and tells you what to do instead:

```
Error: read-modify-write operations are not allowed for `shared` variables
        Use `core.atomic.atomicOp!"+="(var, 1)` instead
```

`__gshared` is a rawer version of `shared`.
It doesn't forbid anything.

#### Practice: C - TLS on Demand

The perspective of C towards TLS is opposed to that of D: in C/C++ everything is shared by default.
This makes multithreading easier and more lightweight to implement than in D, because synchronisation is left entirely up to the developer, at the cost of potential unsafety.

Of course we can specify that some data belongs to the TLS, by preceding the declaration of a variable with `__thread` keyword.
First, compile and run the code in `support/race-condition/c/race_condition_tls.c` a few times.
As expected, the result is different each time.

1. Modify the declaration of `var` and add the `__thread` keyword to place the variable in the TLS of each thread.
Recompile and run the code a few more times.
You should see that in the end, `var` is 0.

[Quiz 1](./quiz/tls-synchronization.md)

[Quiz 2](./quiz/tls-var-copies.md)

2. Print the address and value of `var` in each thread.
See that they differ.

3. Modify the value of `var` in the `main()` function before calling `pthread_create()`.
Notice that the value doesn't propagate to the other threads.
This is because, upon creating a new thread, its TLS is initialised. 

## Scheduling

- https://github.com/kissen/threads
- https://www.schaertl.me/posts/a-bare-bones-user-level-thread-library/

Up to now we know that the OS decides which **thread** (not process) runs on each CPU core at each time.
Now we'll learn about the component that performs this task specifically: **the scheduler**.

There are thousands of threads running at any time in a modern OS.
The job of the scheduler is to run and pause threads as well as allocate them to the CPU cores, with the following goals:

- **fairness**: we do want all threads to get the same chance to run, i.e. run for about the same amount of time
- **throughput**: we want to run as many threads to completion so as to complete as many tasks as we can

To do this, the scheduler must decide, at given times, to suspend a thread, save its current state and let another one run in its place.
This event is called a **context switch**.
A context switch means changing the state of one thread (the replaced thread) from RUNNING to WAITING and the state of the replacement thread from READY / WAITING to RUNNING.

- Quiz?

### User-Level vs Kernel-Level Threads

There are two types of threads.
The threads you've used so far are **kernel-level threads (KLT)**.
They are created and scheduled in the kernel of the OS.
One of the most important of their features is that they offer true parallelism.
With KLTs, we can truly run a program on all the cores of our CPU at once.
But we must pay a price for this: scheduling them is very complex and context switches are costly (in terms of time), especially when switching threads belonging to different processes. 

By contrast, **user-level threads (ULT)** are managed by the user space.
More of the ULTs created by a program are generally mapped to the same kernel thread.
If a process only creates ULTs, then they will all be mapped to the single, main kernel thread of the process.
So if we cannot run code in parallel with ULTs, then why use them?
Well, for I/O-intensive programs (those that do lots of network calls or file operations like reads and writes - web servers are a good example), threads are expected to perform lots of blocking calls, which causes context switches.
In such cases, user-level threads may be useful as context switches bring less overhead between user-level threads.

### Practice: User-Level Threads Scheduler

Go to `support/scheduler`.
It contains a minimalist **user-level threads** scheduler.
Compiling it produces a shared library called `libult.so`.
You can also consult its [documentation](https://www.schaertl.me/posts/a-bare-bones-user-level-thread-library/).
It explains the API as well as its implementation.
The API exposed by the scheduling library is very simple.
It is only made up of 3 functions:

- `threads_create()` creates a new ULT
- `threads_exit()` moves the current ULT to the COMPLETED state
- `threads_join()` waits for a given thread to end and saves its return value in the `result` argument

Look inside `support/libult/threads.c`.
Here you will find the 3 functions mentioned above.

The scheduler only uses 3 states: RUNNING, READY, COMPLETED.

[Quiz](./quiz/number-of-running-ults.md)

The threads in the READY and COMPLETED states are kept in 2 separate queues.
When the scheduler wants to run a new thread, it retrieves it from the READY queue.
When a thread ends its execution, it is added to the COMPLETED queue, together with its return value.

[Quiz](./quiz/why-use-completed-queue.md)

### Thread Control Block

Let's dissect the `threads_create()` function a bit.
It first initialises its queues and the timer for preemption.
We'll discuss preemption [in the next section](#preemption).
After performing initialisations, the function creates a `TCB` object.
TCB stands for **Thread Control Block**.

During the [lecture](../lecture/), you saw that the kernel stores one instance of a [`task_struct`](https://elixir.bootlin.com/linux/v5.19.11/source/include/linux/sched.h#L726) for each thread.
Remember that its most important fields are:

```C
struct task_struct {
	unsigned int                    __state;

	void                           *stack;

	unsigned int                    flags;

	int                             on_cpu;
	int                             prio;

	/* Scheduler information */
	struct sched_entity             se;
	const struct sched_class        *sched_class;

	/* The VAS: memory mappings */
	struct mm_struct                *mm;

	int                             exit_state;
	int                             exit_code;

	pid_t                           pid;

	struct task_struct __rcu        *parent;

	/* Child processes */
	struct list_head                children;

	/* Open file information */
	struct files_struct             *files;
};
```

As you can see, this `struct` stores _metadata_ regarding a given thread.
The same is true about the `TCB` in `libult.so`:

```c
typedef struct {
	int id;
	ucontext_t context;
	bool has_dynamic_stack;
	void *(*start_routine) (void *);
	void *argument;
	void *return_value;
} TCB;
```

It stores the thread ID (tid - `id`), similar to the PID of a process.
It stores a pointer to the function passed as argument to `threads_create()` (`start_routine`), as well as the argument (`argument`) and the returned value (`return_value`) of said function.

In addition, the `TCB` stores a `context`.
From the [man page of the `ucontext.h` header](https://pubs.opengroup.org/onlinepubs/7908799/xsh/ucontext.h.html), we can see this type is a `struct` that stores a pointer to the stack of the current thread (`uc_stack`).
This is similar to the `stack` pointer in the `task_struct` above.
In short, we can say a context defines an execution unit, such as a thread.
**This is why changing the running thread is called a context switch.**

Let's compare this context with another thread implementation, from [Unikraft](https://unikraft.org/).
We'll look at the [`uk_thread`](https://github.com/unikraft/unikraft/blob/9bf6e63314a401204c02597834fb02f63a29aaf4/lib/uksched/include/uk/thread.h#L55-L76) `struct`, which is the TCB used in Unikraft:

```c
struct uk_thread {
	const char *name;
	void *stack;
	void *tls;
	void *ctx;
	UK_TAILQ_ENTRY(struct uk_thread) thread_list;
	uint32_t flags;
	__snsec wakeup_time;
	bool detached;
	struct uk_waitq waiting_threads;
	struct uk_sched *sched;
	void (*entry)(void *);
	void *arg;
	void *prv;
};
```

There are some visible similarities between the two TCBs.

[Quiz](./quiz/tcb-libult-unikraft.md)

Therefore, the workflow for creating and running a thread goes like this:

```
main thread
    |
    `--> threads_create()
            |
	    |--> tcb_new()
            `--> makecontext()
	            |
		    `--> handle_thread_start() - called using the context
		            |
			    |--> start_routine() - the thread runs
                            `--> threads_exit()
```

Compile and run the code in `support/libult/test_ult.c`.
If you encounter the following error when running `test_ult`, remember what you learned about the loader and using custom shared libraries in the [Software Stack lab](../../software-stack/lab).

```
./test_ult: error while loading shared libraries: libult.so: cannot open shared object file: No such file or directory
```

> Hint: Use the `LD_LIBRARY_PATH` variable.

Notice that the threads run their code and alternatively, because their prints appear interleaved.
[In the next section](#preemption), we'll see how this is done.

[Quiz](./quiz/ult-thread-ids.md)

### Preemption

All schedulers can be split into two categoriesThere are two types of schedulers: **preemptive** and **cooperative**.
When discussing this distinction, we need to first define the notion of **yielding**.
Yielding the CPU means that a thread suspends its own execution and enters the WAITING or READY state, either as a result of a blocking call (I/O operations or calling the scheduler's `yield()` function directly).
So, yielding the CPU triggers a context switch whereby the current thread stops running and another one resumes or starts running in its place.

#### Cooperative Scheduling

Cooperative scheduling relies on the fact that threads themselves would yield the CPU at some point.
If threads don't abide by this convention, they end up monopolising the CPU (since there is no one to suspend them) and end up starving the others.
You can get a feel of this behaviour by running the cooperative [scheduler from Unikraft](https://github.com/unikraft/unikraft/blob/staging/lib/ukschedcoop/schedcoop.c) in the [lecture demos](../../lecture/demo/cooperative-scheduling).

This type of schedulers have the advantage of being lightweight, thus resulting in less overhead caused by context switches.
However, as we've already stated, they rely on the "good will" of threads to yield the CPU at some point.

#### Preemptive Scheduling

Preemptive scheduling solve the issue stated above by leaving the task of suspending the currently RUNNING thread and replacing it with another one from the READY queue up to the scheduler.
This increases its complexity and the duration of context switches, but threads now are not required to worry about yielding themselves and can focus on running their code and performing the task for which they are created.

Preemptive schedulers assign only allow threads to run for a maximum amount of time, called **time slice** (usually a few milliseconds).
They use timers which fire when a new time slice passes.
The firing of one such timer causes a context switch whereby the currently RUNNING thread is _preempted_ (i.e. suspended) and replaced with another one.


[Quiz](./quiz/type-of-scheduler-in-libult.md)

Look at the `init_profiling_timer()` function.
It creates a timer that generates a `SIGPROF` signal and then defines a handler (the `handle_sigprof()` function) that is executed whenever the `SIGPROF` signal is received.

[Quiz](./quiz/time-slice-value.md)

It is this handler that performs the context switch per se.
Look at its code.
It first saves the context of the currernt thread:

```C
ucontext_t *stored = &running->context;
ucontext_t *updated = (ucontext_t *) context;

stored->uc_flags = updated->uc_flags;
stored->uc_link = updated->uc_link;
stored->uc_mcontext = updated->uc_mcontext;
stored->uc_sigmask = updated->uc_sigmask;
```

Then it places current thred in the `ready` queue and replaces it with the first thread in the same queue.
This algorithm (that schedules the first thread in the READY queue) is called _Round-Robin_:

```C
if (queue_enqueue(ready, running) != 0) {
	abort();
}

if ((running = queue_dequeue(ready)) == NULL) {
	abort();
}
```

The new `running` thread is resumed upon setting the current context to it:

```C
if (setcontext(&running->context) == -1) {
	abort();
}
```

This is how scheduling is done!

#### Practice: Another Time Slice

1. Modify the time slice set to the timer to 2 seconds.
Re-run the code in `support/libult/test_ult.c`.
Notice that now no context switch happens between the 2 created threads because they end before the timer can fire.

2. Now change the `printer_thread()` function in `test_ult.c` to make it run for more than 2 seconds.
See that now the prints from the two threads appear intermingled.
Add prints to the `handle_sigprof()` function in `support/libult/threads.c` to see the context switch happen.

## Arena

### Threads and Processes: `clone`

Let's go back to our initial demos that used threads and processes.
We'll see that in order to create both threads and processes, the underlying Linux syscall is `clone`.
For this, we'll run both `sum_array_threads` and `sum_array_processes` under `strace`.
As we've already established, we're only interested in the `clone` syscall:

```
student@os:~/.../lab/support/sum-array/d$ strace -e clone ./sum_array_threads 2
clone(child_stack=0x7f60b56482b0, flags=CLONE_VM|CLONE_FS|CLONE_FILES|CLONE_SIGHAND|CLONE_THREAD|CLONE_SYSVSEM|CLONE_SETTLS|CLONE_PARENT_SETTID|CLONE_CHILD_CLEARTID, parent_tid=[1819693], tls=0x7f60b5649640, child_tidptr=0x7f60b5649910) = 1819693
clone(child_stack=0x7f60b4e472b0, flags=CLONE_VM|CLONE_FS|CLONE_FILES|CLONE_SIGHAND|CLONE_THREAD|CLONE_SYSVSEM|CLONE_SETTLS|CLONE_PARENT_SETTID|CLONE_CHILD_CLEARTID, parent_tid=[1819694], tls=0x7f60b4e48640, child_tidptr=0x7f60b4e48910) = 1819694

student@os:~/.../lab/support/sum-array/d$ strace -e clone ./sum_array_processes 2
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f7a4e346650) = 1820599
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f7a4e346650) = 1820600
```

We ran each program with an argument of 2, so we have 2 calls to `clone`.
Notice that in the case of threads, the `clone` syscall receives more arguments.
The relevant flags passed as arguments when creating threads are documented in [`clone`'s man page](https://man.archlinux.org/man/clone3.2.en):
- `CLONE_VM`: the child and the parent process share the same VAS
- `CLONE_{FS,FILES,SIGHAND}`: the new thread shares the filesystem information, file and signal handlers with the one that created it
The syscall also receives valid pointers to the new thread's stack and TLS, i.e. the only parts of the VAS that are distinct between threads (although they are technically accessible from all threads).

By contrast, when creating a new process, the arguments of the `clone` syscall are simpler (i.e. fewer flags are present).
Remember that in both cases `clone` creates a new **thread**.
When creating a process, `clone` creates this new thread within a new separate address space.

### Libraries for Parallel Processing

In `support/sum-array/d/sum_array_threads.d` we spawned threads "manually" by using the `spawn` function.
This is **not** a syscall, but a wrapper over the most common thread-management API in POSIX-based operating systems (such as Linux, FreeBSD, macOS): POSIX Threads or `pthreads`.
By inspecting the [implementation of `spawn`](https://github.com/dlang/phobos/blob/352258539ca54e640e862f79b2b8ec18aafa7d94/std/concurrency.d#L618-L622), we see that it creates a `Thread` object, on which it calls the `start()` method.
In turn, [`start()` uses `pthread_create()`](https://github.com/dlang/dmd/blob/cc117cd45c7d72ce5a87b775e65a9d13fa4d4424/druntime/src/core/thread/osthread.d#L454-L486) on POSIX systems.

Still, `pthread_create()` is not yet a syscall.
In order to see what syscall `pthread_create()` uses, check out [this section at the end of the lab](#threads-and-processes-clone).

Most programming languages provide a more advanced API for handling parallel computation.
D makes no exception.
Its standard library exposes the [`std.parallelism`](https://dlang.org/phobos/std_parallelism.html), which provides a series of parallel processing functions.
One such function is `reduce` which splits an array between a given number of threads and applies a given operation to these chunks.
In our case, the operation simply adds the elements to an accumulator: `a + b`.
Follow and run the code in `support/sum-array/d/sum_array_threads_reduce.d`.

The number of threads is used within a [`TaskPool`](https://dlang.org/phobos/std_parallelism.html#.TaskPool).
This structure is a thread manager (not scheduler).
It silently creates the number of threads we request and then `reduce` spreads its workload between these threads.

Now run the `sum_array_threads_reduce` binary using 1, 2, 4, and 8 threads as before.
You'll see lower running times than `sum_array_threads` due to the highly-optimised code of the `reduce` function.
For this reason and because library functions are usually much better tested than your own code, it is always preferred to use a library function for a given task.

### Shared Memory

As you remember from the [Data chapter](../../data/), one way to allocate a given number of pages is to use the `mmap()` syscall.
Let's look at its [man page](https://man7.org/linux/man-pages/man2/mmap.2.html), specifically at the `flags` argument.
Its main purpose is to determine the way in which child processes interact with the mapped pages.

[Quiz](./quiz/mmap-cow-flag.md)

Now let's test this flag, as well as its opposite: `MAP_SHARED`.
Compile and run the code in `support/shared-memory/shared_memory.c`.

1. See the value read by the parent id different from that written by the child.
Modify the `flags` parameter of `mmap()` so they are the same.

2. Create a semaphore in the shared page and use it to make the parent signal the child before it can exit.
Use the API defined in [`semaphore.h`](https://man7.org/linux/man-pages/man0/semaphore.h.0p.html).
**Be careful!**
The value written and read previously by the child and the parent, respectively, must not change.

One way of creating a shared semaphore is to place it within a shared memory area, as we've just done.
This only works between "related" processes.
If you want to share a semaphore or other types of memory between any two processes, you need filesystem support.
For this, you should use **named semaphores**, created using [`sem_open()`](https://man7.org/linux/man-pages/man3/sem_open.3.html).
You'll get more accustomed to such functions in the [Application Interaction chapter](../../app-interact/).

### Mini-shell

#### Fist Step: `system` Dissected

You already know that `system` calls `fork()` and `execve()` to create the new process.
Let's see how and why.
First, we run the following command to trace the `execve()` syscalls used by `sleepy_creator`.
We'll leave `fork()` for later.

```
student@os:~/.../support/sleepy$ strace -e execve -ff -o syscalls ./sleepy_creator
```

At this point you will get two files whose names start with `syscalls`, followed by some numbers.
Those numbers are the PIDs of the parent and the child process.
Therefore, the file with the higher number contains logs of the `execve` and `clone` syscalls issued by the parent process, while
the other logs those two syscalls when made by the child process.
Let's take a look at them.
The numbers below will differ from those on your system:

```
student@os:~/.../support/sleepy:$ cat syscalls.2523393  # syscalls from parent process
execve("sleepy_creator", ["sleepy_creator"], 0x7ffd2c157758 /* 39 vars */) = 0
--- SIGCHLD {si_signo=SIGCHLD, si_code=CLD_EXITED, si_pid=2523394, si_uid=1052093, si_status=0, si_utime=0, si_stime=0} ---
+++ exited with 0 +++

student@os:~/.../support/sleepy:$ cat syscalls.2523394  # syscalls from child process
execve("/bin/sh", ["sh", "-c", "sleep 10"], 0x7ffd36253be8 /* 39 vars */) = 0
execve("/usr/bin/sleep", ["sleep", "10"], 0x560f41659d40 /* 38 vars */) = 0
+++ exited with 0 +++
```

[Quiz](./quiz/who-calls-execve-parent.md)

Now notice that the child process doesn't simply call `execve("/usr/bin/sleep" ...)`.
It first changes its virtual address space (VAS) to that of a `bash` process (`execve("/bin/sh" ...)`) and then that `bash` process switches its VAS to `sleep`.
Therefore, calling `system(<some_command>)` is equivalent to running `<some_command>` in the command line.

With this knowledge in mind, let's implement our own mini-shell.
Start from the skeleton code in `support/mini-shell/mini_shell.c`.
We're already running our Bash interpreter from the command line, so there's no need to `exec` another Bash from it.
Simply `exec` the command.

[Quiz](./quiz/mini-shell-stops-after-command.md)

So we need a way to "save" the `mini_shell` process before `exec()`-ing our command.
Find a way to do this.

> **Hint**:  You can see what `sleepy` does and draw inspiration from there.
> Use `strace` to also list the calls to `clone()` perfromed by `sleepy` or its children.
> [Remember](#threads-and-processes-clone) what `clone()` is used for and use its parameters to deduce which of the two scenarios happens to `sleepy`. 

**Moral of the story**: We can add another step to the moral of [our previous story](#practice-fork).
When spawning a new command, the call order is:
- parent: `fork()`, `exec()`, `wait()`
- child: `exit()`

#### Command Executor in Another language

Now implement the same functionality (a Bash command executor) in any other language, other than C/C++.
Use whatever API is provided by your language of choice for creating and waiting for processes.

### The GIL

Throughout this lab you might have noticed that there were no thread exercises _in Python_.
If you did, you probably wondered why.
It's not because Python does not support threads, because it does, but because of a mechanism called the **Global Interpreter Lock**, or GIL.
As its name suggests, this is a lock implemented inside most commonly used Python interpreter (CPython), which only allows **one** thread to run at a given time.
As a consequence, multithreaded programs written in Python run **concurrently**, not in parallel.
For this reason, you will see no speedup even when you run an embarrassingly parallel code in parallel.

However, keep in mind that this drawback does not make threads useless in Python.
They are still useful and widely used when a process needs to perform many IO-bound tasks (i.e.: tasks that involve many file reads / writes or network requests).
Such tasks run many blocking syscalls that require the thread to switch from the RUNNING state to WAITING.
Doing so voluntarily makes threads viable because they rarely run for their entire time slice and spend most of the time waiting for data.
So it doesn't hurt them to run concurrently, instead of in parallel.

Do not make the confusion to believe threads in Python are [user-level threads](#user-level-vs-kernel-level-threads).
[`threading.Thread`](https://docs.python.org/3/library/threading.html#threading.Thread)s are kernel-level threads.
It's just that they are forced to run concurrenntly by the GIL.

#### Practice: Array Sum in Python

Let's first probe this by implementing two parallel versions of the code in `support/sum-array/python/sum_array_sequential.py`.
One version should use threads and the other should use processes.
Run each of them using 1, 2, 4, and 8 threads / processes respectively and compare the running times.
Notice that the running times of the multithreaded implementation do not decrease.
This is because the GIL makes it so that those threads that you create essentially run sequentially.

The GIL also makes it so that individual Python instructions are atomic.
Run the code in `support/race-condition/python/race_condition.py`.
Every time, `var` will be 0 because the GIL doesn't allow the two threads to run in parallel and reach the critical section at the same time.
This means that the instructions `var += 1` and `var -= 1` become atomic.

#### But Why?

Unlike Bigfoot, or the Loch Ness monster, we have proof that the GIL is real.
At first glance, this seems like a huge disadvantage.
Why force threads to run sequentially?
The answer has to do with memory management.
In the [Data chapter](../../data), you learned that one way of managing memory is via _garbage collection_ (GC).
In Python, the GC uses reference counting, i.e. each object also stores the number of live pointers to it (variables that reference it).
You can see that this number needs to be modified atomically by the interpreter to avoid race conditions.
This involves adding locks to **all** Python data structures.
This large number of locks doesn't scale for a language as large and open as Python.
In addition, it also introduces the risk of _deadlocks_.
You can read more on this topic [in this article](https://realpython.com/python-gil/) and if you think eliminating the GIL looks like an easy task, which should have been done long ago, check the requirements [here](https://wiki.python.org/moin/GlobalInterpreterLock).
They're not trivial to meet.

Single-threadedness is a common trope for interpreted languages to use some sort of GIL.
[Ruby MRI, the reference Ruby interpreter](https://git.ruby-lang.org/ruby.git) uses a similar mechanism, called the [Global VM Lock](https://ivoanjo.me/blog/2022/07/17/tracing-ruby-global-vm-lock/).
JavaScript is even more straightforward: it is single-threaded by design, also for GC-related reasons.
It does, however support asynchronous actions, but these are executed on the same thread as every other code.
This is implemented by placing each instruction on a [call stack](https://medium.com/swlh/what-does-it-mean-by-javascript-is-single-threaded-language-f4130645d8a9). 

### Atomic Assembly

No, this section is not about nukes, sadly :(.
Instead, we aim to get accustomed to the way in which the x86 ISA provides atomic instructions.

This mechanism looks very simple.
It is but **one instruction prefix**: `lock`.
It is not an instruction with its own separate opcode, but a prefix that slightly modifie the opcode of the following instructions to make the CPU execute it atomically (i.e. with exclusive access to the data bus).

`lock` must only be place before an instruction that executes a _read-modify-write_ action.
For example, we cannot place it before a `mov` instruction, as the action of a `mov` is simply `read` or `write`.
Instead, we can place it in front of an `inc` instruction if its operand is memory.

Look at the code in `support/race-condition/asm/race_condition_lock.S`.
It's an Assembly equivalent of the code you've already seen many times so far (such as `support/race-condition/d/race_condition.d`).
Assemble and run it a few times.
Notice the different results you get.

Now add the `lock` prefix before `inc` and `dec`.
Reassemble and rerun the code.
And now we have synchronised the two threads by leveraging CPU support.

- TODO add this section to the lecture

### Synchronisation - Thread-Safe Data Structure

Now it's time for a fully practical exercise.
Go to `support/CLIST/`.
In the file `clist.c` you'll find a simple implementation of an array list.
Although correct, it is not (yet) thread-safe.

The code in `test.c` verifies its single-threaded correctness while the one in `test_parallel.c` verifies it works properly with multiple threads.
Your task is to synchronise this data structure using whichever primitives you like.
Try to keep the implementation efficient.
Aim to decrease your running times as much as you can.
