<template>
    <el-container>
        <div v-if="!currentProfile || !currentProfile.is_admin" style="padding: 20px; text-align: center;">
            <p>Tämä sivu on vain pääkäyttäjille</p>
        </div>
        <div v-else class="admin-logs-container">
            <div class="header-controls">
                <div class="filter-controls">
                    <el-select v-model="statusFilter" placeholder="Suodata tila" size="default">
                        <el-option label="Kaikki" value="all" />
                        <el-option label="Onnistuneet" value="success" />
                        <el-option label="Virheet" value="error" />
                    </el-select>
                </div>
                <el-button @click="loadLogs" :loading="loading" type="primary" size="default">
                    <el-icon><Refresh /></el-icon> Päivitä
                </el-button>
            </div>

            <div v-if="loading && logs.length === 0" style="text-align: center; padding: 40px;">
                <el-icon class="is-loading" :size="30"><Loading /></el-icon>
                <p>Ladataan lokeja...</p>
            </div>

            <div v-else-if="filteredLogs.length === 0" style="text-align: center; padding: 40px; color: #909399;">
                <p>Ei lokimerkintöjä</p>
            </div>

            <div v-else class="logs-list">
                <el-card 
                    v-for="log in filteredLogs" 
                    :key="log.id"
                    class="log-card"
                    shadow="hover"
                >
                    <div class="log-header" @click="toggleLog(log.id)">
                        <div class="log-main-info">
                            <div class="log-time">{{ formatTimestamp(log.timestamp) }}</div>
                            <el-tag 
                                :type="log.status === 'success' ? 'success' : 'danger'" 
                                size="small"
                                class="log-status-tag"
                            >
                                {{ log.status }}
                            </el-tag>
                            <span class="log-count">{{ log.count }}</span>
                            <el-icon class="expand-icon" :class="{ 'expanded': expandedLogs.has(log.id) }">
                                <ArrowDown />
                            </el-icon>
                        </div>
                    </div>
                    
                    <el-collapse-transition>
                        <div v-show="expandedLogs.has(log.id)" class="log-details">
                            <div v-if="log.details" class="detail-row">
                                <span class="detail-label">Tiedot:</span>
                                <span class="detail-value">{{ log.details }}</span>
                            </div>
                            <div v-if="log.error" class="detail-row error-row">
                                <span class="detail-label">Virhe:</span>
                                <span class="detail-value error-text">{{ log.error }}</span>
                            </div>
                        </div>
                    </el-collapse-transition>
                </el-card>
            </div>
        </div>
    </el-container>
</template>

<script>
import { fetchLogs } from '../utils/api.js';
import { Refresh, Loading, ArrowDown } from '@element-plus/icons-vue';

export default {
    name: 'AdminLogs',
    components: {
        Refresh,
        Loading,
        ArrowDown
    },
    props: {
        currentProfile: Object
    },
    data() {
        return {
            logs: [],
            loading: false,
            expandedLogs: new Set(),
            statusFilter: 'all'
        };
    },
    computed: {
        filteredLogs() {
            if (this.statusFilter === 'all') {
                return this.logs;
            } else if (this.statusFilter === 'success') {
                return this.logs.filter(log => log.status === 'success');
            } else if (this.statusFilter === 'error') {
                return this.logs.filter(log => log.status !== 'success');
            }
            return this.logs;
        }
    },
    mounted() {
        if (this.currentProfile && this.currentProfile.is_admin) {
            this.loadLogs();
        }
    },
    watch: {
        currentProfile(newVal) {
            if (newVal && newVal.is_admin) {
                this.loadLogs();
            }
        }
    },
    methods: {
        async loadLogs() {
            this.loading = true;
            try {
                const data = await fetchLogs();
                this.logs = data.logs || [];
            } catch (error) {
                console.error('Failed to load logs:', error);
                this.$message.error('Lokien lataus epäonnistui');
            } finally {
                this.loading = false;
            }
        },
        formatTimestamp(timestamp) {
            if (!timestamp) return '-';
            const date = new Date(timestamp);
            return date.toLocaleString('fi-FI', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        },
        toggleLog(logId) {
            if (this.expandedLogs.has(logId)) {
                this.expandedLogs.delete(logId);
            } else {
                this.expandedLogs.add(logId);
            }
        }
    }
};
</script>

<style scoped>
.admin-logs-container {
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px);
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
}

.header-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 12px;
}

.filter-controls {
    flex: 0 0 auto;
    width: 200px;
}

.logs-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 100%;
}

.log-card {
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}

.log-card :deep(.el-card__body) {
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.log-card:hover {
    transform: translateY(-2px);
}

.log-header {
    display: flex;
    align-items: center;
    user-select: none;
    width: 100%;
}

.log-main-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
}

.log-time {
    font-weight: 500;
    font-size: 14px;
    color: #303133;
    white-space: nowrap;
    flex-shrink: 0;
}

.log-status-tag {
    flex-shrink: 0;
}

.log-count {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
    flex-shrink: 0;
}

.expand-icon {
    transition: transform 0.3s;
    color: #909399;
    flex-shrink: 0;
    margin-left: auto;
}

.expand-icon.expanded {
    transform: rotate(180deg);
}

.log-details {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #EBEEF5;
}

.detail-row {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 14px;
}

.detail-row:last-child {
    margin-bottom: 0;
}

.detail-label {
    font-weight: 600;
    color: #606266;
    min-width: 60px;
}

.detail-value {
    color: #303133;
    flex: 1;
    word-break: break-word;
}

.error-row {
    margin-top: 12px;
}

.error-text {
    color: #F56C6C;
}

@media (max-width: 768px) {
    .admin-logs-container {
        height: calc(100vh - 100px);
        padding: 8px;
    }

    .header-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }

    .filter-controls {
        width: 100%;
        max-width: none;
    }

    .header-controls .el-button {
        width: 100%;
    }

    .log-main-info {
        flex-wrap: nowrap;
        overflow: hidden;
    }

    .log-time {
        font-size: 12px;
        min-width: 120px;
    }

    .detail-row {
        flex-direction: column;
        gap: 4px;
    }

    .detail-label {
        min-width: auto;
    }
}
</style>
