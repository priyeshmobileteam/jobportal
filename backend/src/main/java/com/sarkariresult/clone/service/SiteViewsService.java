package com.sarkariresult.clone.service;

import com.sarkariresult.clone.model.SiteViews;
import com.sarkariresult.clone.repository.SiteViewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteViewsService {

    @Autowired
    private SiteViewsRepository repository;

    private static final String GLOBAL_COUNTER_ID = "global_counter";

    @Transactional
    public Long incrementGlobalViews() {
        SiteViews views = repository.findById(GLOBAL_COUNTER_ID)
                .orElse(new SiteViews(GLOBAL_COUNTER_ID, 0L));
        views.setCount(views.getCount() + 1);
        repository.save(views);
        return views.getCount();
    }

    public Long getGlobalViews() {
        return repository.findById(GLOBAL_COUNTER_ID)
                .map(SiteViews::getCount)
                .orElse(0L);
    }
}
