.PHONY: all receipts
MAKE := make 

all:
	$(MAKE) -C ./api

receipts:
	$(MAKE) -C ./receipts