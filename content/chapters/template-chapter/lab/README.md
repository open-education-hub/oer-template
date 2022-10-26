# Template chapter

This is an instance of a lab placeholder. This will be used to showcase the different highlights of the syntax.

In order to use links to to outside resources, you can add them as [such](http://example.com).

This is a list of all the best cuisines in the world
- Indian
- Italian
- French

In order to make emphasize keywords, you can use **bold** words.
To suggest a more metaphorical and less literal meaning of a phrase, you can use _italic_ words.

## Section the first

For each skill learned in the lab, you will use a subsection which will touch up on new concepts.

For integrating figures, you will use `![Example SVG](./media/app-os-cpu-interaction.svg)`.

![Example SVG](./media/app-os-cpu-interaction.svg)

## Second section

Single instances of commands should be written using monotype fonts such as this `ls`.

For longer outputs, you will use the following syntax:

```console
student@os:~$ which ls
/usr/bin/ls

student@os:~$ file /usr/bin/ls
/usr/bin/ls: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=6e3da6f0bc36b6398b8651bbc2e08831a21a90da, for GNU/Linux 3.2.0, stripped
```

### Practice: Baby steps

We recommend that for practice, you add a subsection for the exercises.
This will make it so you can delimit the exercises from the lab's text.


1. You can number the exercises as such
And have the text roll over to the next line.

1. This is a second numbered exercise

**Be careful!**
You can even link to other chapters internally [like this](./quiz/template-question.md)

Another neat feature is that you can add inline code that uses language specific highlight.

```Python
with event:
    while len(messages) == 0:
        event.wait()
```

For now, a quiz can only be linked to as such: [Quiz 1](./quiz/template-question.md)
