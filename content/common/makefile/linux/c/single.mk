all: $(BINARY)

# Get the relative path to the directory of the current makefile.
MAKEFILE_DIR = $(dir $(lastword $(MAKEFILE_LIST)))
include $(MAKEFILE_DIR)c.mk

$(BINARY): $(OBJS) $(LOGGER)
	$(CC) $^ $(LDFLAGS) -o $@ $(LDLIBS)

clean::
	-rm -f $(BINARY)

.PHONY: all clean
