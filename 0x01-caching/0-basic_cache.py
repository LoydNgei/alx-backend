#!/usr/bin/env python3
""" A class BasicCache that inherit from BaseCaching and is a caching system"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """Define basic caching"""
    def put(self, key, item):
        """Assign to a dict"""
        if key is None or item is None:
            pass
        else:
            self.cache_data[key] = item

    def get(self, key):
        """Get value of key"""
        if key is None or self.cache_data.get(key) is None:
            return None
        else:
            return self.cache_data[key]
